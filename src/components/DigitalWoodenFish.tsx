'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getAudioGenerator } from '@/utils/audioGenerator';

export function DigitalWoodenFish() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMerit, setShowMerit] = useState(false);
  const [isAutoTapping, setIsAutoTapping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const autoTapIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { isDark } = useTheme();
  const audioGenerator = getAudioGenerator();

  // 监听主题变化事件
  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const merits = [
    '功德+1', '心静如水', '福慧双修', '善念增长',
    '业障消除', '智慧开启', '慈悲心起', '清净自在'
  ];

  const handleTap = useCallback(() => {
    setCount(prev => prev + 1);
    setIsAnimating(true);
    setShowMerit(true);

    // 播放空灵的木鱼敲击声喵
    if (!isMuted) {
      audioGenerator.playWoodenFishSound();
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    setTimeout(() => {
      setShowMerit(false);
    }, 1500);
  }, [isMuted, audioGenerator]);

  useEffect(() => {
    if (isAutoTapping) {
      autoTapIntervalRef.current = setInterval(handleTap, 1000);

      return () => {
        if (autoTapIntervalRef.current) {
          clearInterval(autoTapIntervalRef.current);
          autoTapIntervalRef.current = null;
        }
      };
    }

    if (autoTapIntervalRef.current) {
      clearInterval(autoTapIntervalRef.current);
      autoTapIntervalRef.current = null;
    }
  }, [isAutoTapping, handleTap]);

  // 清理函数，在组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (autoTapIntervalRef.current) {
        clearInterval(autoTapIntervalRef.current);
      }
    };
  }, []);

  const resetCount = () => {
    setCount(0);
  };

  const toggleAutoTap = () => {
    setIsAutoTapping(!isAutoTapping);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const currentMerit = merits[count % merits.length];

  return (
    <motion.div
      key={forceUpdate}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-bento p-5 transition-all duration-300 h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-xl ${
            isDark ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-50 text-amber-600'
          }`}>
            <Heart className="w-4 h-4" />
          </div>
          <span className={`text-sm font-bold tracking-wide ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>电子木鱼</span>
        </div>

        {/* 静音/声音切换按钮 */}
        <button
          onClick={toggleMute}
          className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
            isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
          title={isMuted ? '开启声音' : '静音'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center py-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative"
          >
            <button
              onClick={handleTap}
              aria-label="敲击木鱼"
              className={`w-20 h-16 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border relative overflow-hidden group flex items-center justify-center cursor-pointer ${
                isDark
                  ? 'bg-gradient-to-br from-amber-900/30 to-amber-800/10 border-amber-800/30 hover:border-amber-700/50'
                  : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50 hover:border-amber-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wooden-fish.svg"
                alt="木鱼"
                className="w-10 h-10 opacity-90 transition-transform duration-300 group-hover:scale-105"
              />
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={isAnimating ? { scale: 1.6, opacity: 0 } : { scale: 0, opacity: 1 }}
                className={`absolute inset-0 border-2 rounded-2xl ${
                  isDark ? 'border-amber-500/50' : 'border-amber-400/50'
                }`}
              />
            </button>
            <AnimatePresence>
              {showMerit && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.7 }}
                  animate={{ opacity: 1, y: -25, scale: 1 }}
                  exit={{ opacity: 0, y: -35, scale: 0.7 }}
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-none z-20 min-w-max"
                >
                  <div className={`text-white px-2.5 py-1 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1 ${
                    isDark
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-950/20'
                      : 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-amber-200/50'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    {currentMerit}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={toggleAutoTap}
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isAutoTapping
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : (isDark
                      ? 'bg-slate-800 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50'
                      : 'bg-gray-100 text-gray-600 border border-gray-200/50 hover:bg-gray-200')
              }`}
              title="自动敲击"
            >
              {isAutoTapping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={resetCount}
              className={`p-2 rounded-xl border shadow-sm transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                  : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
              title="重置"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 进度条与计数 */}
        <div className="w-full mt-3">
          <div className="flex justify-between items-center text-[10px] font-bold mb-1 px-1">
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>功德进度</span>
            <span className={`font-mono ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{count}</span>
          </div>
          <div className={`w-full rounded-full h-2 overflow-hidden ${
            isDark ? 'bg-slate-900/60' : 'bg-gray-100'
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400'
              }`}
              style={{ width: `${Math.min((count % 100) / 100 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}