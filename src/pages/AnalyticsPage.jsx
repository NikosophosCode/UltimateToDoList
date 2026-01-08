import React from 'react';

/**
 * AnalyticsPage Component
 * Página de estadísticas y análisis de productividad
 */
function AnalyticsPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Your productivity insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4">
          <div className="text-purple-200 text-sm mb-1">Total Tasks</div>
          <div className="text-white text-3xl font-bold">0</div>
        </div>
        <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-4">
          <div className="text-pink-200 text-sm mb-1">Completed</div>
          <div className="text-white text-3xl font-bold">0</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4">
          <div className="text-blue-200 text-sm mb-1">In Progress</div>
          <div className="text-white text-3xl font-bold">0</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4">
          <div className="text-green-200 text-sm mb-1">Success Rate</div>
          <div className="text-white text-3xl font-bold">0%</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-[#2d1b3d] rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-white font-semibold mb-4">Weekly Progress</h2>
        <div className="space-y-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="flex items-center gap-3">
              <span className="text-gray-400 w-10 text-sm">{day}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${Math.random() * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity Score */}
      <div className="bg-[#2d1b3d] rounded-xl p-6 border border-gray-700">
        <h2 className="text-white font-semibold mb-4">Productivity Score</h2>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="351.86"
                strokeDashoffset="87.96"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-white">75</span>
              <span className="text-sm text-gray-400">Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
