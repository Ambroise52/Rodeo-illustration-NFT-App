

import React, { useState, useEffect } from 'react';
import { Collection, GeneratedData, CollectionRequest } from '../types';
import { dataService } from '../services/dataService';
import { Icons } from './Icons';
import Gallery from './Gallery';
import { 
  Button, 
  Card, 
  Empty, 
  EmptyHeader, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyContent, 
  EmptyMedia,
  Input,
  Textarea,
  Field,
  FieldLabel,
  FieldDescription,
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Kbd,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from './UIShared';

interface CollectionsProps {
  userId: string;
  onRemixCollection: (collection: Collection) => void;
  onSelect: (item: GeneratedData) => void;
}

const AutoSlideCard: React.FC<{ 
  collection: Collection; 
  onRemix: () => void;
  onView: () => void;
  userId: string;
}> = ({ collection, onRemix, onView, userId }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [status, setStatus] = useState<{ isMember: boolean; isPending: boolean; isOwner: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (collection.previewImages && collection.previewImages.length > 1) {
      const interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % collection.previewImages!.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [collection.previewImages]);

  useEffect(() => {
    checkStatus();
  }, [collection.id, userId]);

  const checkStatus = async () => {
    try {
      const s = await dataService.getCollectionStatus(collection.id, userId);
      setStatus(s);
    } catch (e) {
      console.error("Failed to check status", e);
    }
  };

  const handleRequestAccess = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await dataService.requestCollectionAccess(collection.id, userId);
      setStatus({ isMember: false, isPending: true, isOwner: false });
      alert('Request sent! The creator will be notified.');
    } catch (e) {
      console.error(e);
      alert('Failed to send request');
      checkStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await dataService.cancelCollectionRequest(collection.id, userId);
      setStatus({ isMember: false, isPending: false, isOwner: false });
      alert('Request cancelled.');
    } catch (e) {
      console.error(e);
      alert('Failed to cancel request');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await dataService.joinCollection(collection.id, userId);
      setStatus({ isMember: true, isPending: false, isOwner: false });
    } catch (e) {
      console.error(e);
      alert('Failed to join collection');
    } finally {
      setLoading(false);
    }
  };

  const currentImage = collection.previewImages?.[imgIndex] || null;
  
  // Locked logic: 
  // If Public: Not locked (even if not member)
  // If Private: Locked if NOT Member AND NOT Owner.
  // Note: If Status is PENDING, isMember is false, so it IS Locked.
  const isLocked = !collection.isPublic && (!status?.isMember && !status?.isOwner);
  const canView = !isLocked;
  
  const displayedMembers = collection.memberPreviews || [];
  const totalMemberCount = collection.memberCount || 0;
  const remainingMembers = totalMemberCount - displayedMembers.length;

  return (
    <Card 
      onClick={() => canView ? onView() : null}
      className={`overflow-hidden group transition-all duration-500 flex flex-col h-full bg-dark-card border border-dark-border ${canView ? 'cursor-pointer hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]' : 'cursor-default border-dark-border/50'}`}
    >
      <div className="aspect-[4/3] bg-black/50 relative shrink-0 overflow-hidden">
        {/* Image Layer - Show blurred if locked */}
        {currentImage ? (
          <img 
            src={currentImage} 
            alt="Collection Preview" 
            className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${
              isLocked 
                ? 'blur-md opacity-40 scale-110 group-hover:scale-125 group-hover:translate-x-1 group-hover:rotate-1' 
                : 'opacity-100 group-hover:scale-110'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 gap-2 bg-black/80">
            <Icons.Image className="w-12 h-12 opacity-20" />
          </div>
        )}
        
        {/* Dark Overlay for Lock */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
             <div className="bg-black/60 p-4 rounded-full border border-white/10 mb-3 shadow-2xl group-hover:shadow-neon-pink/20 transition-all duration-500 group-hover:scale-110 group-hover:border-neon-pink/30">
               <Icons.Lock className="w-6 h-6 text-gray-300 group-hover:text-neon-pink group-hover:animate-pulse transition-colors duration-300" />
             </div>
             <span className="font-mono text-xs uppercase font-bold text-gray-300 tracking-widest bg-black/60 px-3 py-1 rounded-full border border-white/5 group-hover:border-white/20 transition-all">
               {status?.isPending ? 'Request Pending' : 'Private Collection'}
             </span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 pointer-events-none z-20"></div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-4 left-4 z-20">
           <div className="flex items-center gap-2">
             <h3 className="text-xl font-bold text-white drop-shadow-md">{collection.name}</h3>
             {!collection.isPublic && !isLocked && <Icons.Lock className="w-4 h-4 text-neon-pink" />}
           </div>
        </div>

        {/* Remix Button - Only if access granted (NOT LOCKED) */}
        {!isLocked && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemix(); }}
            className="absolute top-4 right-4 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-neon-cyan z-30 shadow-lg"
            title="Remix this vibe"
          >
            <Icons.Zap className="w-4 h-4 fill-current" />
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow relative z-20">
        <p className="text-sm text-gray-400 mb-3 break-words">{collection.description || "No description provided."}</p>
        
        {collection.tags && collection.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {collection.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
            {collection.tags.length > 3 && (
              <span className="text-[10px] text-gray-500 py-0.5">+{collection.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex justify-between items-center pt-3 border-t border-dark-border">
           
           {/* Member Stack */}
           <div className="flex items-center">
             <div className="flex -space-x-2 mr-2">
               {displayedMembers.length > 0 ? (
                 displayedMembers.map((m, i) => (
                   <Avatar key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-dark-card border-none bg-dark-card">
                     <AvatarImage src={m.avatarUrl} />
                     <AvatarFallback className="bg-gray-800 text-[8px]">{m.username.substring(0,1).toUpperCase()}</AvatarFallback>
                   </Avatar>
                 ))
               ) : (
                 <div className="h-6 w-6 rounded-full bg-gray-800 ring-2 ring-dark-card flex items-center justify-center">
                   <Icons.User className="w-3 h-3 text-gray-500" />
                 </div>
               )}
             </div>
             {remainingMembers > 0 ? (
               <span className="text-xs text-gray-500 font-medium">+ {remainingMembers} members</span>
             ) : (
               <span className="text-xs text-gray-500 font-medium">{displayedMembers.length > 0 ? 'Members' : 'New'}</span>
             )}
           </div>
           
           {status === null ? (
             <Button variant="secondary" size="sm" disabled className="opacity-70">
               <Icons.RefreshCw className="w-3 h-3 mr-1 animate-spin" />
               <span className="text-[10px]">Loading...</span>
             </Button>
           ) : (
             <div className="flex items-center gap-2">
               {/* 1. VIEW BUTTON */}
               {/* Only active if unlocked. If locked/pending, disabled or hidden */}
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={(e) => { e.stopPropagation(); if(canView) onView(); }}
                 disabled={!canView}
                 className={!canView ? "opacity-50 cursor-not-allowed" : ""}
               >
                 View
               </Button>
               
               {/* 2. JOIN / REQUEST BUTTON (Conditionally visible) */}
               {!status.isMember && !status.isOwner && (
                 <>
                   {collection.isPublic ? (
                     <Button 
                       variant="default" 
                       size="sm" 
                       onClick={handleJoin} 
                       disabled={loading} 
                       className="bg-white hover:bg-neon-cyan hover:text-black border-none text-black font-bold"
                     >
                        {loading ? <Icons.RefreshCw className="w-3 h-3 animate-spin" /> : <Icons.Plus className="w-3 h-3 mr-1" />}
                        Join
                     </Button>
                   ) : status.isPending ? (
                     <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleCancelRequest}
                        disabled={loading}
                        className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all group/cancel"
                     >
                       {loading ? <Icons.RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Icons.X className="w-3 h-3 mr-1" />}
                       <span className="group-hover/cancel:hidden">Pending</span>
                       <span className="hidden group-hover/cancel:inline">Cancel</span>
                     </Button>
                   ) : (
                     <Button 
                       variant="default" 
                       size="sm" 
                       onClick={handleRequestAccess} 
                       disabled={loading} 
                       className="bg-white hover:bg-neon-pink hover:text-white border-none text-black font-bold"
                     >
                       {loading ? <Icons.RefreshCw className="w-3 h-3 animate-spin" /> : <Icons.Lock className="w-3 h-3 mr-1" />}
                       Request Access
                     </Button>
                   )}
                 </>
               )}
             </div>
           )}
        </div>
      </div>
    </Card>
  );
};

export const ManageRequestsModal: React.FC<{ collectionId: string; onClose: () => void }> = ({ collectionId, onClose }) => {
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [collectionId]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await dataService.getPendingRequests(collectionId);
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'approve' | 'deny') => {
    try {
      if (action === 'approve') {
        await dataService.approveRequest(requestId);
      } else {
        await dataService.denyRequest(requestId);
      }
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (e) {
      console.error(e);
      alert(`Failed to ${action} request`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
      <Card className="w-full max-w-md p-0 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold">Pending Requests</h2>
          <button onClick={onClose}><Icons.X className="w-5 h-5 hover:text-white text-gray-400" /></button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1">
          {loading ? (
            <div className="flex justify-center p-8"><Icons.RefreshCw className="w-6 h-6 animate-spin text-neon-cyan" /></div>
          ) : requests.length === 0 ? (
            <Empty className="border-none bg-transparent p-0">
              <EmptyHeader>
                <EmptyMedia variant="icon"><Icons.User className="text-gray-500" /></EmptyMedia>
                <EmptyTitle>No Requests</EmptyTitle>
                <EmptyDescription>All caught up! No pending requests for this collection.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-white/5 rounded-lg border border-dark-border gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback>{req.userName?.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-white">{req.userName || 'Unknown User'}</p>
                      <p className="text-[10px] text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-end">
                    <Button variant="outline" size="sm" className="pr-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20 h-8" onClick={() => handleAction(req.id, 'approve')}>
                      Accept <Kbd className="bg-green-500/20 text-green-300 border-green-500/20">⏎</Kbd>
                    </Button>
                    <Button variant="outline" size="sm" className="pr-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20 h-8" onClick={() => handleAction(req.id, 'deny')}>
                      Cancel <Kbd className="bg-red-500/20 text-red-300 border-red-500/20">Esc</Kbd>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export const CreateCollectionModal: React.FC<{ onClose: () => void; onCreated: (newId: string) => void; userId: string }> = ({ onClose, onCreated, userId }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAddTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newId = await dataService.createCollection(name, desc, userId, tags, isPublic);
      onCreated(newId);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to create collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
      <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">New Collection</h2>
          <button onClick={onClose}><Icons.X className="w-5 h-5 hover:text-white text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Cyberpunk Apes" />
          </Field>
          
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's the vibe?" />
          </Field>

          <Field>
            <FieldLabel>Visibility</FieldLabel>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 px-3 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${isPublic ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan' : 'bg-transparent border-dark-border text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <Icons.Globe className="w-4 h-4" /> Public
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 px-3 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${!isPublic ? 'bg-neon-pink/20 text-neon-pink border-neon-pink' : 'bg-transparent border-dark-border text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <Icons.Lock className="w-4 h-4" /> Private
              </button>
            </div>
            <FieldDescription>
              {isPublic ? "Anyone can find and remix this collection." : "Only visible to you."}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Style Tags (AI Context)</FieldLabel>
            <FieldDescription>Add keywords like "neon", "pixel art", "dark" to guide the AI.</FieldDescription>
            <div className="flex gap-2 mt-1">
              <Input 
                value={currentTag} 
                onChange={e => setCurrentTag(e.target.value)} 
                placeholder="Add a tag..." 
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">Add</Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-black/20 rounded-lg">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 px-2 py-1 rounded-full">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><Icons.X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Icons.RefreshCw className="animate-spin" /> : "Create Collection"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export const EditCollectionModal: React.FC<{ collection: Collection; onClose: () => void; onUpdated: () => void }> = ({ collection, onClose, onUpdated }) => {
    const [name, setName] = useState(collection.name);
    const [desc, setDesc] = useState(collection.description);
    const [currentTag, setCurrentTag] = useState("");
    const [tags, setTags] = useState<string[]>(collection.tags || []);
    const [isPublic, setIsPublic] = useState(collection.isPublic !== false);
    const [loading, setLoading] = useState(false);
  
    const handleAddTag = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
        setCurrentTag("");
      }
    };
  
    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter(t => t !== tagToRemove));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await dataService.updateCollection(collection.id, { name, description: desc, tags, isPublic });
        onUpdated();
        onClose();
      } catch (e) {
        console.error(e);
        alert("Failed to update collection");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
        <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Edit Collection</h2>
            <button onClick={onClose}><Icons.X className="w-5 h-5 hover:text-white text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea value={desc} onChange={e => setDesc(e.target.value)} />
            </Field>

            <Field>
            <FieldLabel>Visibility</FieldLabel>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 px-3 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${isPublic ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan' : 'bg-transparent border-dark-border text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <Icons.Globe className="w-4 h-4" /> Public
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 px-3 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${!isPublic ? 'bg-neon-pink/20 text-neon-pink border-neon-pink' : 'bg-transparent border-dark-border text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <Icons.Lock className="w-4 h-4" /> Private
              </button>
            </div>
            <FieldDescription>
              {isPublic ? "Anyone can find and remix this collection." : "Only visible to you."}
            </FieldDescription>
          </Field>

            <Field>
              <FieldLabel>Style Tags</FieldLabel>
              <div className="flex gap-2 mt-1">
                <Input value={currentTag} onChange={e => setCurrentTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)} />
                <Button type="button" onClick={handleAddTag} variant="secondary">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
                    #{tag} <button type="button" onClick={() => removeTag(tag)}><Icons.X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </Field>
            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Icons.RefreshCw className="animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
};

const CollectionDetailView: React.FC<{ 
    collection: Collection; 
    onBack: () => void; 
    onRemix: () => void; 
    currentUserId: string;
    onUpdateClick: () => void;
    onSelect: (item: GeneratedData) => void;
}> = ({ collection, onBack, onRemix, currentUserId, onUpdateClick, onSelect }) => {
    const [items, setItems] = useState<GeneratedData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRequests, setShowRequests] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [members, setMembers] = useState<{id: string, username: string, avatarUrl?: string}[]>([]);

    const isCreator = collection.creatorId === currentUserId;

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                // Load items
                const data = await dataService.getCollectionItems(collection.id);
                setItems(data);
                
                // Load pending requests for creator
                if (isCreator) {
                  const reqs = await dataService.getPendingRequests(collection.id);
                  setPendingCount(reqs.length);
                }

                // Load members
                const mems = await dataService.getCollectionMembers(collection.id);
                setMembers(mems);
            } catch (e) {
                console.error("Failed to load items", e);
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, [collection.id, isCreator, showRequests]); 

    const handleInvite = () => {
        // Just copy current URL for now as "Invite" action
        navigator.clipboard.writeText(window.location.href);
        alert("Collection link copied to clipboard! Share it with your team.");
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4">
            <div className="mb-8">
                <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 text-gray-400 hover:text-white pl-0">
                    <Icons.ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
                </Button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-dark-card border border-dark-border p-8 rounded-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    {/* Left Info */}
                    <div className="relative z-10 max-w-xl">
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-4xl font-black text-white tracking-tighter">{collection.name}</h1>
                             {isCreator && (
                                 <button onClick={onUpdateClick} className="p-2 text-gray-500 hover:text-white transition-colors" title="Edit Collection">
                                     <Icons.Settings className="w-5 h-5" />
                                 </button>
                             )}
                             {!collection.isPublic && <Icons.Lock className="w-6 h-6 text-neon-pink" />}
                        </div>
                        <p className="text-gray-400 text-lg mb-4 leading-relaxed">{collection.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {collection.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-neon-cyan">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right Info & Actions */}
                    <div className="relative z-10 flex flex-col gap-4 items-end min-w-[280px]">
                        
                        {/* Team Members Card */}
                        <div className="bg-dark-card/80 backdrop-blur-md border border-dark-border p-5 rounded-xl flex flex-col items-center text-center w-full shadow-xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           
                           {/* Avatars */}
                           <div className="flex -space-x-2 mb-3 relative z-10">
                               {members.length === 0 ? (
                                   <div className="w-10 h-10 rounded-full bg-white/5 border-2 border-dark-card flex items-center justify-center">
                                       <Icons.User className="w-5 h-5 text-gray-600" />
                                   </div>
                               ) : (
                                   members.map((m) => (
                                       <Avatar key={m.id} className="w-10 h-10 border-2 border-dark-card ring-2 ring-transparent group-hover:ring-neon-cyan/20 transition-all">
                                           <AvatarImage src={m.avatarUrl} />
                                           <AvatarFallback className="bg-gray-800 text-gray-400 font-bold">{m.username.substring(0,2).toUpperCase()}</AvatarFallback>
                                       </Avatar>
                                   ))
                               )}
                               {(collection.memberCount || 0) > members.length && (
                                   <div className="w-10 h-10 rounded-full bg-dark-card border-2 border-dark-border flex items-center justify-center text-[10px] font-bold text-gray-400 z-10">
                                       +{ (collection.memberCount || 0) - members.length }
                                   </div>
                               )}
                           </div>

                           <h3 className="font-bold text-white mb-1 relative z-10 text-sm">
                               {(collection.memberCount || 0) > 1 ? 'Team Members' : 'No Team Members'}
                           </h3>
                           <p className="text-xs text-gray-400 mb-4 leading-snug relative z-10 max-w-[200px]">
                               {(collection.memberCount || 0) > 1 
                                 ? `${collection.memberCount} creators contributing to this project.` 
                                 : 'Invite your team to collaborate on this project.'}
                           </p>

                           <Button size="sm" variant="outline" className="w-full relative z-10 hover:bg-neon-cyan hover:text-black border-dark-border h-8 text-xs font-bold" onClick={handleInvite}>
                               <Icons.Plus className="w-3 h-3 mr-1" /> Invite Members
                           </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 w-full justify-end">
                            {isCreator && (
                              <Button onClick={() => setShowRequests(true)} variant="secondary" className="relative flex-1">
                                <Icons.User className="w-4 h-4 mr-2" /> Requests
                                {pendingCount > 0 && (
                                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-pink text-[10px] font-bold text-white">
                                    {pendingCount}
                                  </span>
                                )}
                              </Button>
                            )}
                            <Button onClick={onRemix} className="bg-neon-cyan text-black hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex-1">
                                <Icons.Zap className="w-4 h-4 mr-2" /> Remix Style
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Icons.RefreshCw className="w-8 h-8 animate-spin text-neon-cyan" /></div>
            ) : items.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon"><Icons.Image className="w-8 h-8" /></EmptyMedia>
                        <EmptyTitle>Empty Collection</EmptyTitle>
                        <EmptyDescription>No NFTs have been added to this collection yet.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <Gallery 
                    history={items} 
                    onSelect={onSelect} 
                    selectedId={undefined} 
                    title={`${items.length} Items`} 
                />
            )}

            {showRequests && (
              <ManageRequestsModal 
                collectionId={collection.id} 
                onClose={() => setShowRequests(false)} 
              />
            )}
        </div>
    );
};

const ITEMS_PER_PAGE = 9;

const Collections: React.FC<CollectionsProps> = ({ userId, onRemixCollection, onSelect }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Navigation State
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await dataService.getCollections(userId);
      setCollections(data);
      // Refresh selected collection if needed
      if (selectedCollection) {
          const updated = data.find(c => c.id === selectedCollection.id);
          if (updated) setSelectedCollection(updated);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [userId]);

  const handleViewCollection = (col: Collection) => {
      setSelectedCollection(col);
      setView('DETAIL');
  };

  const handleBackToList = () => {
      setSelectedCollection(null);
      setView('LIST');
  };

  const filteredCollections = collections.filter(col => {
    const q = searchQuery.toLowerCase();
    return (
      col.name.toLowerCase().includes(q) ||
      col.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCollections = filteredCollections.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: Scroll to top of list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && view === 'LIST') return <div className="p-12 text-center flex items-center justify-center h-[50vh]"><Icons.RefreshCw className="w-8 h-8 animate-spin mx-auto text-neon-cyan" /></div>;

  return (
    <div className="w-full animate-in fade-in">
      {view === 'LIST' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                <h2 className="text-3xl font-black text-white tracking-tighter">Global Collections</h2>
                <p className="text-gray-400">Remix styles from community curated sets.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <InputGroup className="w-full md:w-64">
                    <InputGroupInput 
                        placeholder="Search collections..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <InputGroupAddon>
                        <Icons.Search className="w-4 h-4" />
                    </InputGroupAddon>
                </InputGroup>
                <Button onClick={() => setShowCreate(true)} className="bg-neon-cyan text-black hover:bg-white whitespace-nowrap">
                    <Icons.Plus className="w-4 h-4 mr-2" /> Create New
                </Button>
                </div>
            </div>

            {filteredCollections.length === 0 ? (
                <Empty>
                <EmptyHeader>
                    {searchQuery ? (
                    <>
                        <EmptyMedia variant="icon"><Icons.Search className="w-8 h-8" /></EmptyMedia>
                        <EmptyTitle>No Matches Found</EmptyTitle>
                        <EmptyDescription>Try adjusting your search terms.</EmptyDescription>
                    </>
                    ) : (
                    <>
                        <EmptyMedia variant="icon"><Icons.Box className="w-8 h-8" /></EmptyMedia>
                        <EmptyTitle>No Collections Yet</EmptyTitle>
                        <EmptyDescription>Be the first to create a themed collection for others to join.</EmptyDescription>
                        <EmptyContent>
                            <Button onClick={() => setShowCreate(true)}>Create Collection</Button>
                        </EmptyContent>
                    </>
                    )}
                </EmptyHeader>
                </Empty>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentCollections.map(col => (
                    <AutoSlideCard 
                    key={col.id} 
                    collection={col} 
                    onRemix={() => onRemixCollection(col)}
                    onView={() => handleViewCollection(col)}
                    userId={userId}
                    />
                ))}
                </div>
            )}

            {totalPages > 1 && (
              <Pagination className="mb-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
      ) : (
          selectedCollection && (
              <CollectionDetailView 
                  collection={selectedCollection}
                  onBack={handleBackToList}
                  onRemix={() => onRemixCollection(selectedCollection)}
                  currentUserId={userId}
                  onUpdateClick={() => setShowEdit(true)}
                  onSelect={onSelect}
              />
          )
      )}

      {showCreate && (
        <CreateCollectionModal 
          userId={userId} 
          onClose={() => setShowCreate(false)} 
          onCreated={() => { loadData(); }} 
        />
      )}

      {showEdit && selectedCollection && selectedCollection.creatorId === userId && (
          <EditCollectionModal 
            collection={selectedCollection}
            onClose={() => setShowEdit(false)}
            onUpdated={() => { loadData(); }}
          />
      )}
    </div>
  );
};

export default Collections;
