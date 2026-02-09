
import { Card } from './types';

export const ADMIN_PASSWORD = "8999";

// Supabase Configuration
// To enable cloud storage, fill in these values from your Supabase Project Settings
export const SUPABASE_URL = ""; 
export const SUPABASE_ANON_KEY = "";

export const INITIAL_CARDS: Card[] = [
  {
    id: "sample-1",
    name: "KT 현대카드 M Edition3",
    condition: "전월 실적 30만원 이상 시",
    annualFee: "국내전용 30,000원 / 해외겸용 30,000원",
    applyUrl: "https://www.hyundaicard.com",
    imageUrl: "https://picsum.photos/seed/ktcard1/400/250",
    benefits: [
      { id: "b1", performance: "30만원 이상", discount: "15,000원 할인" },
      { id: "b2", performance: "70만원 이상", discount: "20,000원 할인" },
      { id: "b3", performance: "프로모션 추가", discount: "5,000원 캐시백" }
    ]
  }
];
