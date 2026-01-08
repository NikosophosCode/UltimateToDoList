import React from 'react';

/**
 * SettingsPage Component
 * Página de configuración de la aplicación
 */
function SettingsPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your preferences</p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <div className="bg-[#2d1b3d] rounded-xl p-4 border border-gray-700">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            Appearance
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <span className="text-gray-300">Theme</span>
              <span className="text-purple-400">Dark</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <span className="text-gray-300">Accent Color</span>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#2d1b3d] rounded-xl p-4 border border-gray-700">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Notifications
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <span className="text-gray-300">Task Reminders</span>
              <div className="w-10 h-6 bg-purple-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <span className="text-gray-300">Daily Summary</span>
              <div className="w-10 h-6 bg-gray-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-[#2d1b3d] rounded-xl p-4 border border-gray-700">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Data & Privacy
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-left">
              <span className="text-gray-300">Export Data</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-left">
              <span className="text-gray-300">Clear Cache</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-[#2d1b3d] rounded-xl p-4 border border-gray-700">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            About
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3">
              <span className="text-gray-300">Version</span>
              <span className="text-gray-400">1.0.0</span>
            </div>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-left">
              <span className="text-gray-300">Terms of Service</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-left">
              <span className="text-gray-300">Privacy Policy</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
