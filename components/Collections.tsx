
import React, { useState, useEffect } from 'react';
import { Collection, GeneratedData } from '../types';
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
  InputGroupAddon
} from './UIShared';

interface CollectionsProps {
  userId: string;
  onRemixCollection: (collection: Collection) => void;
  onSelect: (item: GeneratedData) => void;
}

const AutoSlideCard: React.FC<{ collection: Collection; onClick: () => void }> = ({ collection, onClick }) => {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (collection.previewImages && collection.previewImages.length > 1) {
      const interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % collection.previewImages!.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [collection.previewImages]);

  const currentImage = collection.previewImages?.[imgIndex] || null;

  return (
    <Card 
      className="overflow-hidden group hover:border-neon-cyan/50 transition-all duration-300 flex flex-col h-full cursor-pointer hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-black/50 relative shrink-0">
        {currentImage ? (
          <img 
            src={currentImage} 
            alt="Collection Preview" 
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-xs uppercase">
            Empty Collection
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute bottom-4 left-4">
           <h3 className="text-xl font-bold text-white">{collection.name}</h3>
           <p className="text-xs text-gray-400">{collection.previewImages?.length || 0} items</p>
        </div>

        <div 
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
        >
          <Icons.ArrowRight className="w-4 h-4" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">{collection.description || "No description provided."}</p>
        
        {collection.tags && collection.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {collection.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
            {collection.tags.length > 3 && (
              <span className="text-[10px] text-gray-500 py-0.5">+{collection.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex justify-between items-center pt-2 border-t border-dark-border">
           <span className="text-[10px] uppercase font-bold text-gray-500 truncate max-w-[100px]">Created by {collection.creatorId.substring(0, 6)}...</span>
        </div>
      </div>
    </Card>
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
        await dataService.updateCollection(collection.id, { name, description: desc, tags });
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

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const data = await dataService.getCollectionItems(collection.id);
                setItems(data);
            } catch (e) {
                console.error("Failed to load items", e);
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, [collection.id]);

    return (
        <div className="animate-in fade-in slide-in-from-right-4">
            <div className="mb-8">
                <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 text-gray-400 hover:text-white pl-0">
                    <Icons.ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
                </Button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-dark-card border border-dark-border p-8 rounded-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-4xl font-black text-white tracking-tighter">{collection.name}</h1>
                             {collection.creatorId === currentUserId && (
                                 <button onClick={onUpdateClick} className="p-2 text-gray-500 hover:text-white transition-colors" title="Edit Collection">
                                     <Icons.RefreshCw className="w-4 h-4" />
                                 </button>
                             )}
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

                    <div className="relative z-10">
                        <Button onClick={onRemix} className="bg-neon-cyan text-black hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                            <Icons.Zap className="w-4 h-4 mr-2" /> Remix Style
                        </Button>
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
        </div>
    );
};

const Collections: React.FC<CollectionsProps> = ({ userId, onRemixCollection, onSelect }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Navigation State
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await dataService.getCollections();
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

  useEffect(() => { loadData(); }, []);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map(col => (
                    <AutoSlideCard 
                    key={col.id} 
                    collection={col} 
                    onClick={() => handleViewCollection(col)} 
                    />
                ))}
                </div>
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

      {showEdit && selectedCollection && (
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
