
import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-md">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-2">관리자 로그인</h2>
        <p className="text-sm text-gray-500 mb-6">시스템 설정을 변경하려면 비밀번호를 입력하세요.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-4 bg-gray-50 border ${error ? 'border-kt-red' : 'border-gray-100'} rounded-2xl text-center text-2xl tracking-[1em] focus:outline-none focus:ring-2 focus:ring-kt-red/20`}
              placeholder="••••"
            />
            {error && <p className="text-xs text-kt-red mt-2 text-center font-bold">비밀번호가 일치하지 않습니다.</p>}
          </div>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl active:scale-95 transition-transform"
            >
              취소
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-kt-red text-white font-bold rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-transform"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
