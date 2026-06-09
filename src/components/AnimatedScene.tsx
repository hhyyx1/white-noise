'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface AnimatedSceneProps {
  onThemeToggle?: () => void;
}

export function AnimatedScene() {
  const { isDark, isAutoMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setForceUpdate] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 确保组件已挂载，避免 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [isDark]);

  // 监听主题变化事件
  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => prev + 1);
      if (videoRef.current) {
        videoRef.current.load();
      }
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-bento overflow-hidden h-full relative transition-all duration-300 flex flex-col"
      style={{ height: '100%' }}
    >
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-xl ${
            isDark ? 'bg-indigo-950/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className={`text-sm font-bold tracking-wide ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            宁静窗景
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isDark ? 'bg-slate-800/80 text-slate-400 border-slate-700/50' : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}>
            {isAutoMode ? 'AUTO' : 'SYNC'}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isDark ? 'bg-indigo-950/40 text-indigo-300 border-indigo-900/30' : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}>
            {isDark ? 'NIGHT' : 'DAY'}
          </span>
        </div>
      </div>

      {/* Video Scene */}
      <div className="relative flex-1 group overflow-hidden">
        {mounted ? (
          <video
            key={isDark ? 'rain-night' : 'rain-day'}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          >
            <source src={isDark ? '/rain_night.mp4' : '/rain.mp4'} type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center">
            <div className="text-gray-500 text-sm font-medium">加载中...</div>
          </div>
        )}

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/5"></div>

        {/* Mode indicator */}
        <div className="absolute bottom-4 left-4 right-4 transform transition-transform duration-500 group-hover:translate-y-[-2px]">
          <div className={`backdrop-blur-md rounded-xl p-2.5 text-center border ${
            isDark ? 'bg-slate-950/60 border-slate-800/40' : 'bg-white/60 border-white/40'
          }`}>
            <p className={`text-xs font-bold tracking-widest ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {!isDark ? '🌅 RAIN IN MORNING' : '🌙 RAIN IN DEEP NIGHT'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}