import React, { useState } from 'react';
import { Save, Bell, Globe, Clock, Moon } from 'lucide-react';

const PreferencesForm = ({ preferences, onSave }) => {
  const [formData, setFormData] = useState({
    language: preferences?.language || 'en',
    timezone: preferences?.timezone || 'UTC',
    emailNotifications: preferences?.emailNotifications ?? true,
    pushNotifications: preferences?.pushNotifications ?? false,
    darkMode: preferences?.darkMode ?? false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">System Preferences</h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Localization Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-primary uppercase tracking-wider">Localization</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="language" className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="timezone" className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="BST">BST (British Summer Time)</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-border/50" />

        {/* Notifications Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-primary uppercase tracking-wider">Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates about your cases via email.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-full text-accent">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive real-time alerts on your device.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={formData.pushNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesForm;
