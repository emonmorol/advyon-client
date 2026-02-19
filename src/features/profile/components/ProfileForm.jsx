import React, { useState, useEffect } from 'react';
import { Save, X, Edit2, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { profileUpdateSchema, validateForm } from '@/lib/validation/authSchemas';

const ProfileForm = ({ user, onSave, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
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
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const result = validateForm(profileUpdateSchema, formData);
    if (!result.success) {
      setErrors(result.errors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation with Zod
    if (!validate()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
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
    setErrors({});
    setIsEditing(false);
  };

  const inputClass = (fieldName) => `
    w-full px-4 py-3 rounded-lg border bg-background text-foreground
    transition-all duration-200
    ${errors[fieldName] 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-input focus:border-accent focus:ring-accent/20'}
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-foreground">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          disabled={!isEditing}
          className={inputClass('fullName')}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <Info className="h-3 w-3" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium text-foreground">
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          disabled={!isEditing}
          className={inputClass('displayName')}
          placeholder="How should we address you?"
        />
        {errors.displayName && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <Info className="h-3 w-3" />
            {errors.displayName}
          </p>
        )}
      </div>

      {/* Phone & Address Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass('phone')}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <Info className="h-3 w-3" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-foreground">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass('address')}
            placeholder="Your office address"
          />
          {errors.address && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <Info className="h-3 w-3" />
              {errors.address}
            </p>
          )}
        </div>
      </div>

      {/* Language & Timezone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preferred Language */}
        <div className="space-y-2">
          <label htmlFor="preferredLanguage" className="text-sm font-medium text-foreground">
            Preferred Language
          </label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass('preferredLanguage')}
          >
            <option value="en">English</option>
            <option value="bn">Bengali</option>
          </select>
          {errors.preferredLanguage && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <Info className="h-3 w-3" />
              {errors.preferredLanguage}
            </p>
          )}
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label htmlFor="timezone" className="text-sm font-medium text-foreground">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass('timezone')}
          >
            <option value="">Select timezone</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Dhaka">Bangladesh (BST)</option>
          </select>
          {errors.timezone && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <Info className="h-3 w-3" />
              {errors.timezone}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium text-foreground">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={!isEditing}
          rows={4}
          className={inputClass('bio')}
          placeholder="Tell us about yourself..."
        />
        {errors.bio && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <Info className="h-3 w-3" />
            {errors.bio}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg border border-input bg-background text-foreground font-medium transition-all hover:bg-muted/50 flex items-center gap-2"
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium transition-all hover:bg-accent/90 flex items-center gap-2 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium transition-all hover:bg-accent/90 flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
