
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { APP_CONFIG } from '../constants';
import { 
  Button, 
  Input, 
  Textarea, 
  Field, 
  FieldContent, 
  FieldLabel, 
  FieldDescription, 
  FieldGroup, 
  FieldSet, 
  FieldLegend, 
  FieldSeparator,
  Avatar,
  AvatarImage,
  AvatarFallback
} from './UIShared';
import { Icons } from './Icons';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdate }) => {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || '');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dataService.updateUserProfile(profile.id, { username, bio });
      onUpdate();
      alert('Profile updated!');
    } catch (e) {
      console.error(e);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setSaving(true);
      try {
          const reader = new FileReader();
          reader.onload = async (event) => {
              if (event.target?.result) {
                  const base64 = event.target.result as string;
                  const publicUrl = await dataService.uploadImage(base64, profile.id);
                  await dataService.updateUserProfile(profile.id, { avatarUrl: publicUrl });
                  onUpdate();
              }
          };
          reader.readAsDataURL(file);
      } catch (err) {
          console.error(err);
          alert('Failed to upload avatar');
      } finally {
          setSaving(false);
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in space-y-8">
      
      {/* Profile Header & Stats */}
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-6 bg-dark-card border border-dark-border rounded-xl">
          <div className="relative group">
              <Avatar className="w-24 h-24 border-2 border-neon-cyan">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="text-3xl font-black bg-gray-800 text-gray-500">
                      {profile.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
              </Avatar>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs"
              >
                Change
              </button>
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
              />
          </div>
          
          <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black text-white">{profile.username}</h2>
              <p className="text-gray-400 text-sm max-w-lg mx-auto md:mx-0 mt-1">
                  {profile.bio || "No bio yet."}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-black/30 p-3 rounded-lg border border-dark-border">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total Gens</div>
                      <div className="text-xl font-bold text-white">{profile.totalGenerations}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-dark-border">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Portfolio Value</div>
                      <div className="text-xl font-bold text-neon-cyan">{profile.totalValue.toFixed(2)} {APP_CONFIG.CURRENCY_SYMBOL}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-dark-border">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Legendaries</div>
                      <div className="text-xl font-bold text-yellow-400 flex items-center justify-center md:justify-start gap-1">
                          {profile.legendaryCount} <Icons.Sparkles className="w-4 h-4" />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Edit Profile Details</FieldLegend>
          <FieldDescription className="mb-6">
            Update your public profile information.
          </FieldDescription>
          
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <FieldDescription>
                   This is your public display name.
                </FieldDescription>
              </FieldContent>
              <Input 
                id="username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="max-w-md"
              />
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
               <FieldContent>
                 <FieldLabel htmlFor="bio">Bio</FieldLabel>
                 <FieldDescription>
                   Write a short description about yourself (max 160 chars).
                 </FieldDescription>
               </FieldContent>
               <Textarea 
                 id="bio" 
                 value={bio} 
                 onChange={e => setBio(e.target.value)} 
                 className="max-w-md min-h-[100px] resize-none"
                 maxLength={160}
               />
            </Field>

            <FieldSeparator>Actions</FieldSeparator>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost">Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Icons.RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};

export default ProfileSettings;
