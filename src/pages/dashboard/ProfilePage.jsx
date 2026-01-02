import React, { useState } from 'react';
import { User, Settings, Shield, BadgeCheck, FileText } from 'lucide-react';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import ProfileForm from '@/features/profile/components/ProfileForm';
import PreferencesForm from '@/features/profile/components/PreferencesForm';
import { mockUserProfile, mockUserPreferences } from '@/features/profile/data/mockProfileData';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [user, setUser] = useState(mockUserProfile);

  const [preferences, setPreferences] = useState(mockUserPreferences);

  const handleProfileUpdate = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    // In a real app, API call would go here
    console.log("Profile updated:", data);
  };

  const handlePreferencesUpdate = (data) => {
    setPreferences(prev => ({ ...prev, ...data }));
    console.log("Preferences updated:", data);
  };

  const handleAvatarUpdate = (url) => {
    setUser(prev => ({ ...prev, avatarUrl: url }));
  };

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
            <ProfileForm user={user} onSave={handleProfileUpdate} />
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PreferencesForm preferences={preferences} onSave={handlePreferencesUpdate} />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
               <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Security Settings</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Password change and 2FA settings would go here. This is a placeholder for the security section.
            </p>
            <button className="mt-6 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80">
              Change Password
            </button>
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
                  onClick={() => window.location.href = '/verify'}
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
