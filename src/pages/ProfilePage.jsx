import React from 'react';

/**
 * ProfilePage Component
 * Página de perfil del usuario
 */
function ProfilePage() {
  return (
    <div className="px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Nicolás</h1>
        <p className="text-secondary">Productivity Enthusiast</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-secondary">Email</span>
            <span className="text-primary">user@example.com</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-secondary">Member since</span>
            <span className="text-primary">January 2026</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Tasks completed</span>
            <span className="text-accent font-semibold">0</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary">Theme</span>
              <span className="text-accent">Dark</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">Notifications</span>
              <span className="text-accent">Enabled</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all shadow-md">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
