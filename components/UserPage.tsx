
import React from 'react';
import { Card } from '../types';

interface UserPageProps {
  cards: Card[];
}

const UserPage: React.FC<UserPageProps> = ({ cards }) => {
  return (
    <div className="px-4 py-6 space-y-8 max-w-lg mx-auto">
      {cards.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          등록된 카드 정보가 없습니다.
        </div>
      ) : (
        cards.map((card, index) => (
          <div 
            key={card.id} 
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Card Image Section */}
            <div className="p-6 pb-0 flex justify-center bg-gray-50">
              <img 
                src={card.imageUrl} 
                alt={card.name} 
                className="w-full max-w-[280px] h-auto object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{card.name}</h3>
                <p className="text-sm text-kt-mint font-medium mt-1">{card.condition}</p>
              </div>

              {/* Benefit Table */}
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-500 font-semibold">전월 실적</th>
                      <th className="px-4 py-2 text-right text-gray-900 font-bold">혜택</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {card.benefits.map((benefit) => (
                      <tr key={benefit.id}>
                        <td className="px-4 py-3 text-gray-600">{benefit.performance}</td>
                        <td className="px-4 py-3 text-right font-semibold text-kt-red">{benefit.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>연회비</span>
                  <span>{card.annualFee}</span>
                </div>
                
                <a 
                  href={card.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-kt-red text-white text-center font-bold rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-transform"
                >
                  카드 신청하기
                </a>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserPage;
