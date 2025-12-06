
import React, { useState, useEffect } from 'react';
import { Collection } from '../types';
import { dataService } from '../services/dataService';
import { Icons } from './Icons';
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
  FieldDescription
} from './UIShared';

interface CollectionsProps {
  userId: string;
  onRemixCollection: (collection: Collection) => void;
}

const AutoSlideCard: React.FC<{ collection: Collection; onRemix: () => void }> = ({ collection, onRemix }) => {
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
    <Card className="overflow-hidden group hover:border-neon-cyan/50 transition-all duration-300 flex flex-col h-full">
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

        <button 
          onClick={onRemix}
          className="absolute top-4 right-4 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-neon-cyan"
          title="Remix this vibe"
        >
          <Icons.Zap className="w-4 h-4 fill-current" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">{collection.description || "No description provided."}</p>
        
        {/* Tags Display */}
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
           <Button variant="outline" size="sm" onClick={onRemix}>
              Remix Style
           </Button>
        </div>
      </div>
    </Card>
  );
};

export const CreateCollectionModal: React.FC<{ onClose: () => void; onCreated: () => void; userId: string }> = ({ onClose, onCreated, userId }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
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
      await dataService.createCollection(name, desc, userId, tags);
      onCreated();
      onClose();
    } catch (e) {
      alert("Failed to create collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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

const Collections: React.FC<CollectionsProps> = ({ userId, onRemixCollection }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await dataService.getCollections();
      setCollections(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <div className="p-12 text-center flex items-center justify-center h-[50vh]"><Icons.RefreshCw className="w-8 h-8 animate-spin mx-auto text-neon-cyan" /></div>;

  return (
    <div className="w-full animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Explore Collections</h2>
          <p className="text-gray-400">Remix styles from community curated sets.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-neon-cyan text-black hover:bg-white">
          <Icons.Plus className="w-4 h-4 mr-2" /> Create New
        </Button>
      </div>

      {collections.length === 0 ? (
        <Empty>
          <EmptyHeader>
             <EmptyMedia variant="icon"><Icons.Box className="w-8 h-8" /></EmptyMedia>
             <EmptyTitle>No Collections Yet</EmptyTitle>
             <EmptyDescription>Be the first to create a themed collection for others to join.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setShowCreate(true)}>Create Collection</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(col => (
            <AutoSlideCard 
              key={col.id} 
              collection={col} 
              onRemix={() => onRemixCollection(col)} 
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateCollectionModal 
          userId={userId} 
          onClose={() => setShowCreate(false)} 
          onCreated={loadData} 
        />
      )}
    </div>
  );
};

export default Collections;
