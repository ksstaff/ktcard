
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';
import { Card } from './types';

const isConfigured = SUPABASE_URL && SUPABASE_ANON_KEY;
const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export const storageService = {
  isCloudEnabled: () => !!supabase,

  async fetchCards(): Promise<Card[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('kt_cards')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Error fetching cards:', error);
      return null;
    }
    return data as Card[];
  },

  async saveCards(cards: Card[]): Promise<boolean> {
    if (!supabase) return false;
    
    // We update the whole collection by including an order_index
    const payload = cards.map((card, index) => ({
      ...card,
      order_index: index
    }));

    const { error } = await supabase
      .from('kt_cards')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Error saving cards:', error);
      return false;
    }
    return true;
  },

  async deleteCard(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
      .from('kt_cards')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  async uploadImage(file: File): Promise<string | null> {
    if (!supabase) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `card-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('card-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('card-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
