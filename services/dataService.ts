import { supabase } from './supabaseClient';
import { GeneratedData, UserProfile, Collection, CollectionRequest, Notification } from '../types';

export const dataService = {
  // --- Storage ---
  async uploadImage(base64Data: string, userId: string): Promise<string> {
    try {
      const res = await fetch(base64Data);
      const blob = await res.blob();
      const fileName = `${userId}/${Date.now()}.png`;
      const { data, error } = await supabase.storage
        .from('generations')
        .upload(fileName, blob, { contentType: 'image/png', upsert: true });

      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('generations').getPublicUrl(fileName);
      return publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },

  // --- Generations ---
  async saveGeneration(item: GeneratedData, userId: string): Promise<void> {
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
        collection_id: item.collectionId, // Added collection support
        created_at: new Date(item.timestamp).toISOString()
      });

    if (insertError) throw insertError;

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
      isFavorite: row.is_favorite,
      collectionId: row.collection_id
    }));
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    const { error } = await supabase.from('generations').update({ is_favorite: isFavorite }).eq('id', id);
    if (error) throw error;
  },

  async deleteGeneration(id: string, imageUrl: string): Promise<void> {
    const { error: dbError } = await supabase.from('generations').delete().eq('id', id);
    if (dbError) throw dbError;
    try {
      const url = new URL(imageUrl);
      const path = url.pathname.split('/generations/')[1];
      if (path) await supabase.storage.from('generations').remove([decodeURIComponent(path)]);
    } catch (e) { console.warn("Could not delete image file", e); }
  },

  // --- Profiles ---
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error || !data) return null;
    return {
      id: data.id,
      username: data.username,
      totalGenerations: data.total_generations,
      totalValue: data.total_value,
      legendaryCount: data.legendary_count,
      createdAt: new Date(data.created_at).getTime(),
      avatarUrl: data.avatar_url,
      bio: data.bio
    };
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { error } = await supabase.from('profiles').update({
      username: updates.username,
      bio: updates.bio,
      avatar_url: updates.avatarUrl
    }).eq('id', userId);
    if (error) throw error;
  },

  // --- Collections ---
  async createCollection(name: string, description: string, creatorId: string, tags: string[], isPublic: boolean = true): Promise<string> {
    const { data, error } = await supabase
      .from('collections')
      .insert({ 
        name, 
        description, 
        creator_id: creatorId, 
        tags,
        is_public: isPublic
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    // Auto-add creator as a member
    await supabase.from('collection_members').insert({
      collection_id: data.id,
      user_id: creatorId,
      role: 'OWNER'
    });
    
    return data.id;
  },

  async updateCollection(id: string, updates: Partial<Collection>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic;

    const { error } = await supabase.from('collections').update(dbUpdates).eq('id', id);
    if (error) throw error;
  },

  async getCollections(userId?: string): Promise<Collection[]> {
    let query = supabase.from('collections').select('*');
    
    // If user is logged in, show public collections + their private collections + collections they're members of
    if (userId) {
      // 1. Get IDs of collections where user is a member
      const { data: memberData } = await supabase
        .from('collection_members')
        .select('collection_id')
        .eq('user_id', userId);
      
      const memberIds = memberData?.map(d => d.collection_id) || [];
      
      // 2. Build OR filter: is_public OR creator_id=me OR id IN memberIds
      // Note: Supabase OR syntax needs precise formatting
      let filter = `is_public.eq.true,creator_id.eq.${userId}`;
      if (memberIds.length > 0) {
        // Clean IDs to ensure safe string interpolation
        filter += `,id.in.(${memberIds.join(',')})`;
      }
      
      query = query.or(filter);
    } else {
      // Not logged in - only show public collections
      query = query.eq('is_public', true);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    
    // Fetch preview images for each collection
    const collectionsWithPreviews = await Promise.all(data.map(async (col) => {
      const { data: images } = await supabase
        .from('generations')
        .select('image_url')
        .eq('collection_id', col.id)
        .limit(3)
        .order('created_at', { ascending: false });
      
      // Count members
      const { count } = await supabase
        .from('collection_members')
        .select('*', { count: 'exact', head: true })
        .eq('collection_id', col.id);
      
      return {
        id: col.id,
        name: col.name,
        description: col.description,
        creatorId: col.creator_id,
        createdAt: new Date(col.created_at).getTime(),
        previewImages: images?.map(i => i.image_url) || [],
        tags: col.tags || [],
        isPublic: col.is_public !== false,
        memberCount: count || 0
      };
    }));

    return collectionsWithPreviews;
  },

  async getCollectionItems(collectionId: string): Promise<GeneratedData[]> {
      const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('collection_id', collectionId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Manually fetch creator profiles for these items to avoid complex joins or missing FKs
    const userIds = [...new Set(data.map(d => d.user_id))];
    let profileMap = new Map<string, { username: string, avatarUrl: string }>();

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
      
      if (profiles) {
        profiles.forEach(p => {
          profileMap.set(p.id, { username: p.username, avatarUrl: p.avatar_url });
        });
      }
    }

    return data.map(row => {
      const profile = profileMap.get(row.user_id);
      return {
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
        isFavorite: row.is_favorite,
        collectionId: row.collection_id,
        creatorId: row.user_id,
        creatorName: profile?.username || 'Unknown',
        creatorAvatar: profile?.avatarUrl
      };
    });
  },

  // --- Collection Access & Requests ---
  async checkCollectionAccess(collectionId: string, userId: string): Promise<{ hasAccess: boolean; isPending: boolean }> {
    // Check if user is creator
    const { data: collection } = await supabase
      .from('collections')
      .select('creator_id, is_public')
      .eq('id', collectionId)
      .single();
    
    if (!collection) return { hasAccess: false, isPending: false };
    if (collection.creator_id === userId || collection.is_public) {
      return { hasAccess: true, isPending: false };
    }
    
    // Check if user is a member
    const { data: membership } = await supabase
      .from('collection_members')
      .select('*')
      .eq('collection_id', collectionId)
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to avoid errors if not found
    
    if (membership) return { hasAccess: true, isPending: false };
    
    // Check if user has a pending request
    const { data: request } = await supabase
      .from('collection_requests')
      .select('status')
      .eq('collection_id', collectionId)
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle
    
    if (request?.status === 'PENDING') {
      return { hasAccess: false, isPending: true };
    }
    
    return { hasAccess: false, isPending: false };
  },

  async requestCollectionAccess(collectionId: string, userId: string): Promise<void> {
    // Create request
    const { error: requestError } = await supabase
      .from('collection_requests')
      .insert({
        collection_id: collectionId,
        user_id: userId,
        status: 'PENDING'
      });
    
    if (requestError) throw requestError;
    
    // Get collection and user info
    const { data: collection } = await supabase
      .from('collections')
      .select('name, creator_id')
      .eq('id', collectionId)
      .single();
    
    const { data: user } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    // Notify collection creator
    if (collection?.creator_id) {
      await supabase.from('notifications').insert({
        user_id: collection.creator_id,
        type: 'REQUEST_SENT',
        title: 'New Join Request',
        message: `${user?.username || 'A user'} wants to join "${collection.name}"`,
        collection_id: collectionId,
        is_read: false
      });
    }
  },

  async getCollectionMembers(collectionId: string): Promise<{id: string, username: string, avatarUrl?: string}[]> {
    // 1. Get user IDs from members table
    const { data: members, error } = await supabase
      .from('collection_members')
      .select('user_id')
      .eq('collection_id', collectionId)
      .limit(5);

    if (error || !members) return [];

    const userIds = members.map(m => m.user_id);
    if (userIds.length === 0) return [];

    // 2. Fetch profile details manually to handle potential FK issues safely
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
    
    if (!profiles) return [];

    return profiles.map(p => ({
        id: p.id,
        username: p.username,
        avatarUrl: p.avatar_url
    }));
  },

  async getPendingRequests(collectionId: string): Promise<CollectionRequest[]> {
    // 1. Get requests
    const { data: requests, error } = await supabase
      .from('collection_requests')
      .select('*')
      .eq('collection_id', collectionId)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!requests || requests.length === 0) return [];

    // 2. Manually fetch profiles for these users to ensure we get usernames
    // (Join via foreign key might fail if not explicitly set up in Postgres)
    const userIds = requests.map(r => r.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p.username]));
    
    return requests.map(r => ({
      id: r.id,
      collectionId: r.collection_id,
      userId: r.user_id,
      status: r.status as 'PENDING',
      createdAt: new Date(r.created_at).getTime(),
      userName: profileMap.get(r.user_id) || 'Unknown User'
    }));
  },

  async approveRequest(requestId: string): Promise<void> {
    // Get request details
    const { data: request } = await supabase
      .from('collection_requests')
      .select('*, collections(name)')
      .eq('id', requestId)
      .single();
    
    if (!request) throw new Error('Request not found');
    
    // Update request status
    await supabase
      .from('collection_requests')
      .update({ status: 'APPROVED' })
      .eq('id', requestId);
    
    // Add user as member
    await supabase.from('collection_members').insert({
      collection_id: request.collection_id,
      user_id: request.user_id,
      role: 'MEMBER'
    });
    
    // Notify user
    await supabase.from('notifications').insert({
      user_id: request.user_id,
      type: 'REQUEST_APPROVED',
      title: 'Request Approved!',
      message: `Your request to join "${(request.collections as any)?.name}" was approved`,
      collection_id: request.collection_id,
      is_read: false
    });
  },

  async denyRequest(requestId: string): Promise<void> {
    const { data: request } = await supabase
      .from('collection_requests')
      .select('*, collections(name)')
      .eq('id', requestId)
      .single();
    
    if (!request) throw new Error('Request not found');
    
    await supabase
      .from('collection_requests')
      .update({ status: 'DENIED' })
      .eq('id', requestId);
    
    // Notify user
    await supabase.from('notifications').insert({
      user_id: request.user_id,
      type: 'REQUEST_DENIED',
      title: 'Request Denied',
      message: `Your request to join "${(request.collections as any)?.name}" was denied`,
      collection_id: request.collection_id,
      is_read: false
    });
  },

  // --- Notifications ---
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    return data.map(n => ({
      id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      collectionId: n.collection_id,
      isRead: n.is_read,
      createdAt: new Date(n.created_at).getTime()
    }));
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    return count || 0;
  }
};