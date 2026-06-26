'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button-glass';
import { FormField } from '@/components/ui/form-field';
import { useAuth } from '@/lib/auth-context';
import { Bell, Lock, Eye, ToggleRight, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dataCollection: true,
    twoFactorEnabled: false,
    profileVisibility: 'public',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
    }));
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="card-glass space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
            👤
          </div>
          Profile Information
        </h2>

        <FormField label="Full Name" value={user?.name} disabled />
        <FormField label="Email" type="email" value={user?.email} disabled />
        <FormField label="Role" value={user?.role.replace('_', ' ')} disabled />

        <Button variant="outline">Edit Profile</Button>
      </div>

      {/* Notifications */}
      <div className="card-glass space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Notifications from mobile app</p>
            </div>
            <button
              onClick={() => handleToggle('pushNotifications')}
              className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="card-glass space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Privacy & Security
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">Who can see your profile</p>
            </div>
            <select
              value={settings.profileVisibility}
              onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Extra security for your account</p>
            </div>
            <button
              onClick={() => handleToggle('twoFactorEnabled')}
              className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                settings.twoFactorEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Data Collection</p>
              <p className="text-sm text-muted-foreground">Help us improve with analytics</p>
            </div>
            <button
              onClick={() => handleToggle('dataCollection')}
              className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                settings.dataCollection ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.dataCollection ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <Button variant="outline" className="w-full gap-2">
          <Lock className="w-4 h-4" />
          Change Password
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="card-glass space-y-4 border-2 border-destructive/20 bg-destructive/5">
        <h2 className="text-xl font-bold text-destructive">Danger Zone</h2>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 gap-2">
            <Eye className="w-4 h-4" />
            Deactivate Account
          </Button>
          <Button
            onClick={() => logout()}
            variant="destructive"
            className="w-full justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
