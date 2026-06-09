'use client';

import { useTheme } from '@/hooks/useTheme';
import { Heart, Music, Zap, Users } from 'lucide-react';

export function AboutUs() {
  const { isDark } = useTheme();

  return (
    <div className={`space-y-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
      {/* 介绍 */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDark
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
            : 'bg-gradient-to-br from-blue-300 to-cyan-300'
        }`}>
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-2xl font-semibold mb-4 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          关于泡泡白噪音
        </h3>
        <p className="text-lg leading-relaxed">
          泡泡白噪音是一个专注于为用户提供宁静、放松体验的在线平台。我们相信，在这个快节奏的世界里，每个人都需要一个可以让心灵得到休息的地方。
        </p>
      </div>

      {/* 我们的使命 */}
      <div className={`p-6 rounded-xl ${
        isDark ? 'bg-slate-700/50' : 'bg-blue-50'
      }`}>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          我们的使命
        </h4>
        <p className="leading-relaxed">
          帮助用户在繁忙的生活中找到内心的平静，通过精心挑选的自然声音和环境音效，创造一个属于你的宁静空间。无论是工作专注、学习冥想，还是放松休息，我们都希望能成为你最好的伙伴。
        </p>
      </div>

      {/* 特色功能 */}
      <div>
        <h4 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          我们的特色
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-slate-700/30' : 'bg-gray-50'
          }`}>
            <Music className={`w-6 h-6 mb-2 ${
              isDark ? 'text-blue-400' : 'text-blue-500'
            }`} />
            <h5 className={`font-medium mb-2 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
              丰富的声音库
            </h5>
            <p className="text-sm">
              从温柔雨声到咖啡厅环境音，我们提供多种高质量的自然声音和环境音效。
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-slate-700/30' : 'bg-gray-50'
          }`}>
            <Zap className={`w-6 h-6 mb-2 ${
              isDark ? 'text-green-400' : 'text-green-500'
            }`} />
            <h5 className={`font-medium mb-2 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
              智能主题切换
            </h5>
            <p className="text-sm">
              根据时间自动切换白天/夜间模式，或手动调节，为你提供最舒适的视觉体验。
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-slate-700/30' : 'bg-gray-50'
          }`}>
            <Heart className={`w-6 h-6 mb-2 ${
              isDark ? 'text-red-400' : 'text-red-500'
            }`} />
            <h5 className={`font-medium mb-2 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
              专注工具
            </h5>
            <p className="text-sm">
              内置番茄计时器和电子木鱼，帮助你更好地管理时间和保持内心平静。
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-slate-700/30' : 'bg-gray-50'
          }`}>
            <Users className={`w-6 h-6 mb-2 ${
              isDark ? 'text-purple-400' : 'text-purple-500'
            }`} />
            <h5 className={`font-medium mb-2 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
              用户友好
            </h5>
            <p className="text-sm">
              简洁直观的界面设计，支持键盘快捷键，让你能够快速上手并享受宁静时光。
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}