import React from 'react';
import AvatarUploader from './AvatarUploader';
import { ShieldCheck } from 'lucide-react';

const ProfileHeader = ({ user, onAvatarUpdate }) => {
  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'blocked':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="relative bg-card rounded-xl p-6 shadow-sm border border-border/50 overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-teal-accent/10 -z-0"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-8 sm:pt-4">
        <div className="flex-shrink-0">
          <AvatarUploader 
            currentUrl={user.avatarUrl} 
            onUpload={onAvatarUpdate} 
          />
        </div>

        <div className="flex-1 text-center sm:text-left mb-2 space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {user.displayName || user.fullName || 'User'}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {formatRole(user.role)}
            </span>
            {user.role === 'lawyer' && user.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
            {user.status && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                {user.status === 'in-progress' ? 'Pending' : user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm sm:text-base">
            {user.email}
          </p>

          {user.bio && (
            <p className="text-sm text-muted-foreground/80 max-w-md line-clamp-2 mt-2">
              {user.bio}
            </p>
          )}
        </div>


      </div>
    </div>
  );
};

export default ProfileHeader;
