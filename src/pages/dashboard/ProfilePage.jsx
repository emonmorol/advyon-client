import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Shield, BadgeCheck, FileText, Loader2, Eye, EyeOff } from 'lucide-react';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import ProfileForm from '@/features/profile/components/ProfileForm';
import PreferencesForm from '@/features/profile/components/PreferencesForm';
import { useAuthStore } from '@/store/useAuthStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const { user: authUser, fetchProfile, updateProfile, changePassword, isLoading } = useAuthStore();
  const { 
    preferences, 
    fetchPreferences, 
    updatePreferences: updatePrefs, 
    isLoading: prefsLoading 
  } = usePreferencesStore();

  // Security tab state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPreferences();
  }, [fetchProfile, fetchPreferences]);

  const handleProfileUpdate = async (data) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  // Phase 1.1: Updated to persist preferences to backend
  const handlePreferencesUpdate = async (data) => {
    try {
      await updatePrefs(data);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error('Failed to save preferences');
    }
  };

  const handleAvatarUpdate = async (url) => {
    try {
      await updateProfile({ avatarUrl: url });
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading && !authUser) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading profile...</div>;
  }

  const { user: clerkUser } = useUser();

  // Merge backend data with Clerk data
  // Backend data takes precedence for business logic fields, but Clerk is source of truth for Identity (Email, initial setup)
  const user = {
    ...authUser,
    displayName: authUser?.displayName || clerkUser?.fullName || '',
    email: authUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || '',
    avatarUrl: authUser?.avatarUrl || clerkUser?.imageUrl || '',
    // Additional Clerk fallbacks if useful
    phone: authUser?.phone || (clerkUser?.phoneNumbers?.[0]?.phoneNumber) || '', 
  } || {};

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    ...(user.role === 'Lawyer' ? [{ id: 'verification', label: 'Verification', icon: BadgeCheck }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* Header Section */}
      <ProfileHeader 
        user={user} 
        onEdit={() => setActiveTab('general')} 
        onAvatarUpdate={handleAvatarUpdate}
      />

      {/* Tabs Navigation */}
      <div className="border-b border-border/60 overflow-x-auto custom-scrollbar">
        <nav className="flex space-x-6 min-w-max px-2" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap
                  ${isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Section */}
      <div className="min-h-[400px]">
        {activeTab === 'general' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ProfileForm user={user} onSave={handleProfileUpdate} isLoading={isLoading} />
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {prefsLoading && !preferences ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <PreferencesForm 
                preferences={preferences || {}} 
                onSave={handlePreferencesUpdate} 
                isLoading={prefsLoading}
              />
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Update your password to keep your account secure
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium text-muted-foreground">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-muted-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full mt-6 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'verification' && user.role === 'Lawyer' && (
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Professional Verification</h3>
                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${user.isVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                  {user.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Bar Registration Number</label>
                  <p className="p-3 bg-muted/30 rounded-lg border border-border text-foreground font-mono">{user.barNumber}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Bar Council</label>
                  <p className="p-3 bg-muted/30 rounded-lg border border-border text-foreground">{user.barCouncil}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                  <p className="p-3 bg-muted/30 rounded-lg border border-border text-foreground">{user.experience} Years</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Practice Areas</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.practiceAreas.map(area => (
                      <span key={area} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
             </div>
             
             <div className="mt-8 flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-700">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Verification Documents</p>
                    <p className="opacity-90 mt-1">
                      Manage your professional credentials and verification status.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/profile/verify')}
                  className="px-4 py-2 bg-white border border-blue-200 text-blue-700 font-medium rounded-lg text-sm hover:bg-blue-100 transition-colors"
                >
                  View Verification
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
