
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

  async uploadVideo(videoBlob: Blob, userId: string): Promise<string> {
    try {
      const fileName = `${userId}/${Date.now()}.mp4`;
      const { data, error } = await supabase.storage
        .from('generations')
        .upload(fileName, videoBlob, { contentType: 'video/mp4', upsert: true });

      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('generations').getPublicUrl(fileName);
      return publicUrl;
    } catch (error) {
      console.error('Video Upload failed:', error);
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
        video_url: item.videoUrl, // Save video URL if present
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

  async saveVideoUrl(id: string, videoUrl: string): Promise<void> {
    const { error } = await supabase
      .from('generations')
      .update({ video_url: videoUrl })
      .eq('id', id);
    if (error) throw error;
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
      videoUrl: row.video_url,
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
    // We want to show ALL collections so users can discover private ones and request access.
    let query = supabase.from('collections').select('*');
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    
    // Fetch preview images for each collection
    const collectionsWithPreviews = await Promise.all(data.map(async (col) => {
      // NOTE: If RLS blocks reading generations for private collections, images might be empty.
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

      // Fetch member previews (avatars)
      const { data: members } = await supabase
        .from('collection_members')
        .select('user_id')
        .eq('collection_id', col.id)
        .limit(3);
      
      let memberPreviews: { username: string; avatarUrl?: string }[] = [];
      if (members && members.length > 0) {
         const ids = members.map(m => m.user_id);
         const { data: profiles } = await supabase.from('profiles').select('username, avatar_url').in('id', ids);
         if (profiles) {
           memberPreviews = profiles.map(p => ({
             username: p.username,
             avatarUrl: p.avatar_url
           }));
         }
      }
      
      return {
        id: col.id,
        name: col.name,
        description: col.description,
        creatorId: col.creator_id,
        createdAt: new Date(col.created_at).getTime(),
        previewImages: images?.map(i => i.image_url) || [],
        tags: col.tags || [],
        isPublic: col.is_public !== false,
        memberCount: count || 0,
        memberPreviews: memberPreviews
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
        videoUrl: row.video_url,
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
  async joinCollection(collectionId: string, userId: string): Promise<void> {
    // Safety check: Is user already a member?
    const { data: existing } = await supabase
      .from('collection_members')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) return; // Already a member, do nothing

    const { error } = await supabase.from('collection_members').insert({
      collection_id: collectionId,
      user_id: userId,
      role: 'MEMBER'
    });
    if (error) throw error;
  },

  async getCollectionStatus(collectionId: string, userId: string): Promise<{ isMember: boolean; isPending: boolean; isOwner: boolean }> {
      // Check owner
      const { data: col } = await supabase.from('collections').select('creator_id').eq('id', collectionId).single();
      if (col && col.creator_id === userId) return { isMember: true, isPending: false, isOwner: true };

      // Check member
      const { data: member } = await supabase.from('collection_members').select('user_id').eq('collection_id', collectionId).eq('user_id', userId).maybeSingle();
      if (member) return { isMember: true, isPending: false, isOwner: false };

      // Check pending
      const { data: req } = await supabase.from('collection_requests').select('status').eq('collection_id', collectionId).eq('user_id', userId).eq('status', 'PENDING').maybeSingle();
      if (req) return { isMember: false, isPending: true, isOwner: false };

      return { isMember: false, isPending: false, isOwner: false };
  },

  async requestCollectionAccess(collectionId: string, userId: string): Promise<void> {
    // Safety check: Is there already a pending request?
    const { data: existing } = await supabase
      .from('collection_requests')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('user_id', userId)
      .eq('status', 'PENDING')
      .maybeSingle();

    if (existing) return; // Request already pending

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
        message: `${user?.username || 'Unknown User'} has requested access to ${collection.name}`,
        collection_id: collectionId,
        is_read: false
      });
    }
  },

  async cancelCollectionRequest(collectionId: string, userId: string): Promise<void> {
      await supabase
        .from('collection_requests')
        .delete()
        .eq('collection_id', collectionId)
        .eq('user_id', userId)
        .eq('status', 'PENDING');
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

    // 2. Fetch profile details manually
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

    // 2. Manually fetch profiles
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

    // Get the current user (the Creator approving the request) to include in the notification
    const { data: { user } } = await supabase.auth.getUser();
    let creatorName = 'The creator';
    
    if (user) {
        const { data: creatorProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
        if (creatorProfile) creatorName = creatorProfile.username;
    }
    
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
      title: 'Request Accepted',
      message: `${creatorName} has accepted your request to join ${request.collections?.name || 'the collection'}`,
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

    // Get the current user (the Creator)
    const { data: { user } } = await supabase.auth.getUser();
    let creatorName = 'The creator';
    
    if (user) {
        const { data: creatorProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
        if (creatorProfile) creatorName = creatorProfile.username;
    }
    
    await supabase
      .from('collection_requests')
      .update({ status: 'DENIED' })
      .eq('id', requestId);
    
    // Notify user
    await supabase.from('notifications').insert({
      user_id: request.user_id,
      type: 'REQUEST_DENIED',
      title: 'Request Declined',
      message: `${creatorName} has declined your request to join ${request.collections?.name || 'the collection'}`,
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
  },

  // --- Newsletter ---
  async subscribeToNewsletter(email: string): Promise<void> {
    // Validate email simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Invalid email address");

    // Attempt to save to database.
    // NOTE: This requires a table 'newsletter_subscribers' to exist in Supabase.
    // SQL: create table newsletter_subscribers (id uuid default gen_random_uuid() primary key, email text unique not null, created_at timestamp with time zone default timezone('utc'::text, now()) not null, source text);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, source: 'landing_page_footer' });
    
    if (error) {
       // Handle duplicate email error gracefully (Postgres Unique Violation code is 23505)
       if (error.code === '23505') throw new Error("You are already subscribed!");
       console.error("Subscription DB Error:", error);
       throw new Error("Could not subscribe. Please try again.");
    }
    
    console.log(`[Newsletter] Subscribed: ${email}`);
  }
};
