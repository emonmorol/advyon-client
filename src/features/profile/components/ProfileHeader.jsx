import React from 'react';
import { Edit2, ShieldCheck } from 'lucide-react';
import AvatarUploader from './AvatarUploader';

const ProfileHeader = ({ user, onEdit, onAvatarUpdate }) => {
  return (
    <div className="relative bg-card rounded-xl p-6 shadow-sm border border-border/50 overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-teal-accent/10 -z-0"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-8 sm:pt-4">
        <div className="flex-shrink-0">
          <AvatarUploader 
            currentUrl={user.avatarUrl} 
            onUpload={onAvatarUpdate} 
          />
        </div>

        <div className="flex-1 text-center sm:text-left mb-2 space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {user.displayName}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {user.role}
            </span>
          </div>
          
          <p className="text-muted-foreground text-sm sm:text-base">
            {user.email}
          </p>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
            {user.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                <ShieldCheck className="w-3 h-3" />
                Verified Lawyer
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-0 mb-4 sm:mb-2 self-center sm:self-center">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium text-foreground hover:bg-gray-50 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
