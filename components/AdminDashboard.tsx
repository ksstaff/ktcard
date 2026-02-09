
import React, { useState } from 'react';
import { Card, BenefitRow } from '../types';
import { storageService } from '../supabaseService';

interface AdminDashboardProps {
  cards: Card[];
  onUpdate: (updatedCards: Card[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ cards, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Card | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (card: Card) => {
    setEditingId(card.id);
    setEditForm(JSON.parse(JSON.stringify(card)));
  };

  const addNew = () => {
    const newCard: Card = {
      id: Date.now().toString(),
      name: "",
      condition: "",
      annualFee: "",
      applyUrl: "",
      imageUrl: "https://picsum.photos/400/250",
      benefits: [{ id: "b-init", performance: "", discount: "" }]
    };
    setEditingId(newCard.id);
    setEditForm(newCard);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    setIsSaving(true);
    const exists = cards.find(c => c.id === editForm.id);
    let updatedCards;
    if (exists) {
      updatedCards = cards.map(c => c.id === editForm.id ? editForm : c);
    } else {
      updatedCards = [...cards, editForm];
    }
    
    await onUpdate(updatedCards);
    setIsSaving(false);
    setEditingId(null);
    setEditForm(null);
  };

  const deleteCard = async (id: string) => {
    if (window.confirm("정말 이 카드를 삭제하시겠습니까?")) {
      setIsSaving(true);
      if (storageService.isCloudEnabled()) {
        await storageService.deleteCard(id);
      }
      onUpdate(cards.filter(c => c.id !== id));
      setIsSaving(false);
    }
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const newCards = [...cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newCards.length) return;
    
    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
    onUpdate(newCards);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editForm) return;

    setIsUploading(true);
    
    // Cloud Upload if enabled
    if (storageService.isCloudEnabled()) {
      const publicUrl = await storageService.uploadImage(file);
      if (publicUrl) {
        setEditForm({ ...editForm, imageUrl: publicUrl });
      }
    } else {
      // Local Base64 fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    
    setIsUploading(false);
  };

  const updateBenefit = (index: number, field: keyof BenefitRow, value: string) => {
    if (!editForm) return;
    const newBenefits = [...editForm.benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    setEditForm({ ...editForm, benefits: newBenefits });
  };

  const addBenefitRow = () => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      benefits: [...editForm.benefits, { id: Date.now().toString(), performance: "", discount: "" }]
    });
  };

  const removeBenefitRow = (index: number) => {
    if (!editForm || editForm.benefits.length <= 1) return;
    const newBenefits = editForm.benefits.filter((_, i) => i !== index);
    setEditForm({ ...editForm, benefits: newBenefits });
  };

  if (editingId && editForm) {
    return (
      <div className="p-4 max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">카드 정보 편집</h2>
          <button onClick={() => setEditingId(null)} className="text-sm font-normal text-gray-400">취소</button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
              <span>카드 이미지</span>
              {isUploading && <span className="text-kt-red animate-pulse">업로드 중...</span>}
            </label>
            <div className={`border-2 border-dashed ${isUploading ? 'border-kt-red bg-red-50' : 'border-gray-200'} rounded-2xl p-4 flex flex-col items-center transition-colors`}>
              <img src={editForm.imageUrl} className="w-40 h-auto mb-4 rounded shadow bg-white" />
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="text-xs text-gray-500 w-full" />
              <p className="text-[10px] text-gray-400 mt-2">
                {storageService.isCloudEnabled() ? '✓ 클라우드 저장소가 활성화되었습니다.' : '⚠ 로컬 저장소 모드 (이미지가 공유되지 않을 수 있음)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">카드 이름</label>
              <input 
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full p-3 border rounded-xl" placeholder="예: KT 현대카드 M Edition3" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">발급 조건</label>
              <input 
                value={editForm.condition}
                onChange={(e) => setEditForm({...editForm, condition: e.target.value})}
                className="w-full p-3 border rounded-xl" placeholder="예: 전월 실적 30만원 이상 시" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">신청 URL</label>
              <input 
                value={editForm.applyUrl}
                onChange={(e) => setEditForm({...editForm, applyUrl: e.target.value})}
                className="w-full p-3 border rounded-xl" placeholder="https://..." 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">연회비 정보</label>
              <input 
                value={editForm.annualFee}
                onChange={(e) => setEditForm({...editForm, annualFee: e.target.value})}
                className="w-full p-3 border rounded-xl" placeholder="연회비 상세 내용" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">할인 혜택 테이블</label>
            {editForm.benefits.map((row, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input 
                  value={row.performance} 
                  onChange={(e) => updateBenefit(idx, 'performance', e.target.value)}
                  className="flex-1 p-2 border rounded-lg text-sm" placeholder="실적 조건" 
                />
                <input 
                  value={row.discount} 
                  onChange={(e) => updateBenefit(idx, 'discount', e.target.value)}
                  className="flex-1 p-2 border rounded-lg text-sm" placeholder="혜택 금액" 
                />
                <button onClick={() => removeBenefitRow(idx)} className="p-2 text-red-500">✕</button>
              </div>
            ))}
            <button 
              onClick={addBenefitRow}
              className="w-full py-2 border-2 border-dotted border-gray-300 rounded-xl text-gray-400 text-sm"
            >
              + 행 추가
            </button>
          </div>
        </div>

        <button 
          onClick={saveEdit}
          disabled={isSaving || isUploading}
          className={`w-full py-4 bg-kt-red text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2 ${isSaving || isUploading ? 'opacity-50' : ''}`}
        >
          {isSaving ? <div className="spinner border-white/30 border-l-white w-4 h-4"></div> : null}
          <span>{isSaving ? '저장 중...' : '변경사항 저장'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">카드 관리 목록</h2>
          <p className="text-[10px] mt-1 flex items-center">
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${storageService.isCloudEnabled() ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            {storageService.isCloudEnabled() ? '클라우드 동기화 중' : '로컬 저장 모드'}
          </p>
        </div>
        <button 
          onClick={addNew}
          className="px-4 py-2 bg-black text-white rounded-full text-sm font-bold active:scale-95 transition-transform"
        >
          + 카드 추가
        </button>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={card.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
            <img src={card.imageUrl} className="w-16 h-10 object-contain bg-gray-50 rounded" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{card.name}</h4>
              <p className="text-xs text-gray-400 truncate">{card.condition}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => startEdit(card)} className="text-xs font-bold text-kt-mint">수정</button>
                <button onClick={() => deleteCard(card.id)} className="text-xs font-bold text-red-400">삭제</button>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <button onClick={() => moveCard(index, 'up')} disabled={index === 0} className={`p-2 rounded-lg ${index === 0 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/></svg>
              </button>
              <button onClick={() => moveCard(index, 'down')} disabled={index === cards.length - 1} className={`p-2 rounded-lg ${index === cards.length - 1 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
