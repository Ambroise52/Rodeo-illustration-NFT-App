
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';
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
  FieldSeparator 
} from './UIShared';
import { Icons } from './Icons';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdate }) => {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dataService.updateUserProfile(profile.id, { username, bio, avatarUrl });
      onUpdate();
      alert('Profile updated!');
    } catch (e) {
      console.error(e);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in">
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Public Profile</FieldLegend>
          <FieldDescription className="mb-6">
            Manage how others see you on Infinite NFT Creator.
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

            <FieldSeparator />

            <Field orientation="responsive">
               <FieldContent>
                 <FieldLabel htmlFor="avatar">Avatar URL</FieldLabel>
                 <FieldDescription>
                   Link to an image for your avatar.
                 </FieldDescription>
               </FieldContent>
               <Input 
                 id="avatar" 
                 value={avatarUrl} 
                 onChange={e => setAvatarUrl(e.target.value)} 
                 placeholder="https://..."
                 className="max-w-md"
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
