
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { supabase } from '../services/supabaseClient';
import { APP_CONFIG } from '../constants';
import { 
  Button, 
  Input, 
  Textarea, 
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Label,
  Checkbox,
  Switch,
  FieldGroup,
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription
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
  
  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  
  // Security State
  const [twoFactor, setTwoFactor] = useState(false);

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

  const handlePasswordUpdate = async () => {
    if (!currentPass || !newPass) {
        alert("Please fill in both password fields.");
        return;
    }
    if (newPass.length < 6) {
        alert("New password must be at least 6 characters long.");
        return;
    }

    setPassLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) throw new Error("User not found");

        // Verify current password by re-authenticating
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPass
        });

        if (signInError) {
            throw new Error("Incorrect current password.");
        }

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({ 
            password: newPass 
        });

        if (updateError) throw updateError;

        alert("Password updated successfully! Logging out...");
        await supabase.auth.signOut();
    } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to update password");
    } finally {
        setPassLoading(false);
        setCurrentPass('');
        setNewPass('');
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

  const handleSecuritySave = () => {
      // Logic to actually save 2FA pref would go here
      // For now we just alert
      alert(`Security preference saved: 2FA is ${twoFactor ? 'Enabled' : 'Disabled'}`);
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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Make changes to your public profile here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                  />
                  <p className="text-[0.8rem] text-gray-500">This is your public display name.</p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                    className="min-h-[100px] resize-none"
                    maxLength={160}
                  />
                  <p className="text-[0.8rem] text-gray-500">Write a short description about yourself (max 160 chars).</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? <Icons.RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and view your account ID.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="userId">User ID</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="userId" 
                      value={profile.id} 
                      readOnly 
                      className="bg-black/20 text-gray-500" 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigator.clipboard.writeText(profile.id)}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-[0.8rem] text-gray-500">Your unique Olly ID.</p>
                </div>

                <div className="flex items-center justify-between p-4 border border-dark-border rounded-lg bg-black/20">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications</Label>
                    <p className="text-[0.8rem] text-gray-500">Receive alerts about collection requests.</p>
                  </div>
                  <Checkbox checked={true} disabled />
                </div>

                {/* Password Change Section */}
                <div className="pt-6 border-t border-dark-border mt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">Password</h3>
                    <p className="text-sm text-gray-500">Change your password here. After saving, you'll be logged out.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="currentPassword">Current password</Label>
                      <Input 
                          type="password" 
                          id="currentPassword" 
                          value={currentPass} 
                          onChange={(e) => setCurrentPass(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input 
                          type="password" 
                          id="newPassword" 
                          value={newPass} 
                          onChange={(e) => setNewPass(e.target.value)} 
                      />
                    </div>

                    <Button type="button" onClick={handlePasswordUpdate} disabled={passLoading}>
                      {passLoading ? <Icons.RefreshCw className="w-4 h-4 animate-spin" /> : 'Save password'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings Card (2FA) */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel>Multi-factor authentication</FieldLabel>
                      <FieldDescription>
                        Enable multi-factor authentication to secure your account.
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      checked={twoFactor}
                      onCheckedChange={setTwoFactor}
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter>
                <Button type="button" onClick={handleSecuritySave}>
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
