import React from 'react';

/**
 * ProfilePage Component
 * Página de perfil del usuario
 */
function ProfilePage() {
  return (
    <div className="px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Nicolás</h1>
        <p className="text-gray-400">Productivity Enthusiast</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#2d1b3d] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Email</span>
            <span className="text-white">user@example.com</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Member since</span>
            <span className="text-white">January 2026</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Tasks completed</span>
            <span className="text-purple-400 font-semibold">0</span>
          </div>
        </div>

        <div className="bg-[#2d1b3d] rounded-xl p-4 border border-gray-700">
          <h2 className="text-white font-semibold mb-4">Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Theme</span>
              <span className="text-purple-400">Dark</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Notifications</span>
              <span className="text-purple-400">Enabled</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
