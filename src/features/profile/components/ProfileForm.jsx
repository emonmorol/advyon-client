import React, { useState, useEffect } from 'react';
import { Save, X, Edit2, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

const ProfileForm = ({ user, onSave, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    phone: '',
    address: '',
    bio: '',
    timezone: '',
    preferredLanguage: '',
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.displayName || '',
        displayName: user.displayName || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        timezone: user.timezone || '',
        preferredLanguage: user.preferredLanguage || 'en',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (user) {
      setFormData({
        fullName: user.fullName || user.displayName || '',
        displayName: user.displayName || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        timezone: user.timezone || '',
        preferredLanguage: user.preferredLanguage || 'en',
      });
    }
    setIsEditing(false);
  };

  const timezones = [
    { value: 'Asia/Dhaka', label: 'Asia/Dhaka (GMT+6)' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (GMT+5:30)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
    { value: 'Europe/London', label: 'Europe/London (GMT)' },
    { value: 'UTC', label: 'UTC' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'Bengali' },
    { value: 'hi', label: 'Hindi' },
  ];

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">General Information</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Read-Only Info Banner */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50 flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Role:</span> {formatRole(user?.role)} • 
              <span className="font-medium text-foreground ml-2">Email:</span> {user?.email || 'Not set'}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Email and role cannot be changed. Contact support if you need to modify these.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-muted-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. John Doe"
              />
            ) : (
              <p className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground">
                {formData.fullName || 'Not set'}
              </p>
            )}
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium text-muted-foreground">Display Name</label>
            {isEditing ? (
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="How you want to be called"
              />
            ) : (
              <p className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground">
                {formData.displayName || 'Not set'}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="+1 (555) 000-0000"
              />
            ) : (
              <p className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground">
                {formData.phone || 'Not set'}
              </p>
            )}
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <label htmlFor="timezone" className="text-sm font-medium text-muted-foreground">Timezone</label>
            {isEditing ? (
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Select timezone</option>
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            ) : (
              <p className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground">
                {timezones.find(tz => tz.value === formData.timezone)?.label || 'Not set'}
              </p>
            )}
          </div>

          {/* Preferred Language */}
          <div className="space-y-2">
            <label htmlFor="preferredLanguage" className="text-sm font-medium text-muted-foreground">Preferred Language</label>
            {isEditing ? (
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            ) : (
              <p className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground">
                {languages.find(lang => lang.value === formData.preferredLanguage)?.label || 'English'}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="text-sm font-medium text-muted-foreground">Address</label>
            {isEditing ? (
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="123 Legal Avenue, Suite 100"
              />
            ) : (
              <p className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground min-h-[60px]">
                {formData.address || 'Not set'}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="bio" className="text-sm font-medium text-muted-foreground">Bio</label>
            {isEditing ? (
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="A brief description about yourself..."
              />
            ) : (
              <p className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground min-h-[80px]">
                {formData.bio || 'No bio provided'}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show when editing */}
        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
