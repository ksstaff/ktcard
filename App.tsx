
import React, { useState, useEffect } from 'react';
import { Card } from './types.ts';
import { INITIAL_CARDS, ADMIN_PASSWORD } from './constants.ts';
import { storageService } from './supabaseService.ts';
import UserPage from './components/UserPage.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import LoginModal from './components/LoginModal.tsx';

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      if (storageService.isCloudEnabled()) {
        const cloudCards = await storageService.fetchCards();
        if (cloudCards && cloudCards.length > 0) {
          setCards(cloudCards);
          setIsLoading(false);
          return;
        }
      }

      // Fallback to LocalStorage
      const savedCards = localStorage.getItem('kt_cards_data');
      if (savedCards) {
        try {
          setCards(JSON.parse(savedCards));
        } catch (e) {
          setCards(INITIAL_CARDS);
        }
      } else {
        setCards(INITIAL_CARDS);
      }
      setIsLoading(false);
    };

    initData();
  }, []);

  const saveCards = async (updatedCards: Card[]) => {
    setCards(updatedCards);
    localStorage.setItem('kt_cards_data', JSON.stringify(updatedCards));
    
    if (storageService.isCloudEnabled()) {
      await storageService.saveCards(updatedCards);
    }
  };

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="spinner"></div>
          <p className="text-sm text-gray-400 font-medium">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-kt-red rounded-full flex items-center justify-center text-white font-bold text-xs italic">KT</div>
          <h1 className="text-xl font-extrabold tracking-tight">제휴카드 <span className="text-kt-red">혜택안내</span></h1>
        </div>
        {isAdmin && (
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-kt-red transition-colors"
          >
            관리자 로그아웃
          </button>
        )}
      </header>

      <main className="flex-1 pb-20">
        {isAdmin ? (
          <AdminDashboard cards={cards} onUpdate={saveCards} />
        ) : (
          <UserPage cards={cards} />
        )}
      </main>

      {!isAdmin && (
        <footer className="p-8 text-center bg-gray-100 mt-10">
          <p className="text-xs text-gray-400 mb-4">본 안내는 제휴카드사 사정에 따라 변경될 수 있습니다.</p>
          <button 
            onClick={() => setShowLogin(true)}
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors underline"
          >
            관리자 로그인
          </button>
        </footer>
      )}

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default App;
