import { supabase } from './supabaseClient';
import { GeneratedData, UserProfile } from '../types';

export const dataService = {
  // --- Storage ---
  async uploadImage(base64Data: string, userId: string): Promise<string> {
    try {
      // Convert base64 to blob
      const res = await fetch(base64Data);
      const blob = await res.blob();
      
      const fileName = `${userId}/${Date.now()}.png`;
      const { data, error } = await supabase.storage
        .from('generations')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('generations')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },

  // --- Generations ---
  async saveGeneration(item: GeneratedData, userId: string): Promise<void> {
    // 1. Save to DB
    const { error: insertError } = await supabase
      .from('generations')
      .insert({
        id: item.id,
        user_id: userId,
        image_url: item.imageUrl,
        image_prompt: item.imagePrompt,
        video_prompt: item.videoPrompt,
        character: item.character,
        action: item.action,
        background: item.background,
        color_scheme: item.colorScheme,
        effects: item.effects,
        rarity_tier: item.rarity,
        eth_value: item.ethValue,
        is_favorite: item.isFavorite,
        created_at: new Date(item.timestamp).toISOString()
      });

    if (insertError) throw insertError;

    // 2. Update User Stats Manually
    // This ensures it works with the basic table structure provided without needing extra SQL functions
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    if (profile) {
      await supabase.from('profiles').update({
        total_generations: (profile.total_generations || 0) + 1,
        total_value: (profile.total_value || 0) + item.ethValue,
        legendary_count: (profile.legendary_count || 0) + (item.rarity === 'LEGENDARY' ? 1 : 0)
      }).eq('id', userId);
    }
  },

  async getHistory(userId: string): Promise<GeneratedData[]> {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      imagePrompt: row.image_prompt,
      videoPrompt: row.video_prompt,
      ethValue: row.eth_value,
      timestamp: new Date(row.created_at).getTime(),
      imageUrl: row.image_url,
      rarity: row.rarity_tier,
      character: row.character,
      action: row.action,
      background: row.background,
      colorScheme: row.color_scheme,
      effects: row.effects,
      isFavorite: row.is_favorite
    }));
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    const { error } = await supabase
      .from('generations')
      .update({ is_favorite: isFavorite })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteGeneration(id: string, imageUrl: string): Promise<void> {
    // Delete from DB
    const { error: dbError } = await supabase.from('generations').delete().eq('id', id);
    if (dbError) throw dbError;

    // Try delete from storage (extract path from URL)
    try {
      const url = new URL(imageUrl);
      const path = url.pathname.split('/generations/')[1];
      if (path) {
        await supabase.storage.from('generations').remove([decodeURIComponent(path)]);
      }
    } catch (e) {
      console.warn("Could not delete image file", e);
    }
  },

  // --- Profiles ---
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      username: data.username,
      totalGenerations: data.total_generations,
      totalValue: data.total_value,
      legendaryCount: data.legendary_count,
      createdAt: new Date(data.created_at).getTime()
    };
  }
};