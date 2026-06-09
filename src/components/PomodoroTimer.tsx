'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Timer } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getAudioGenerator } from '@/utils/audioGenerator';

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [forceUpdate, setForceUpdate] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

  useEffect(() => {
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      // 倒计时结束，播放禅意古磬敲击声喵
      audioGenerator.playBowlSound();

      setIsActive(false);
      if (mode === 'work') {
        setMode('break');
        setMinutes(5);
      } else {
        setMode('work');
        setMinutes(25);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds, mode, audioGenerator]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const switchMode = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMode('break');
      setMinutes(5);
    } else {
      setMode('work');
      setMinutes(25);
    }
    setSeconds(0);
  };

  const progress = mode === 'work'
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <motion.div
      key={forceUpdate}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-bento p-5 transition-all duration-300 h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-xl ${
            isDark ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <Timer className="w-4 h-4" />
          </div>
          <span className={`text-sm font-bold tracking-wide ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>番茄专注</span>
        </div>

        <button
          onClick={switchMode}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
            mode === 'work'
              ? (isDark
                  ? 'bg-rose-950/40 text-rose-300 border border-rose-900/30'
                  : 'bg-rose-50 text-rose-600 border border-rose-100')
              : (isDark
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/30'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-100')
          }`}
        >
          {mode === 'work' ? '专注期' : '休息期'}
        </button>
      </div>

      {/* Timer Display */}
      <div className="flex-1 flex flex-col justify-center items-center py-4">
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              className={isDark ? 'text-slate-800/60' : 'text-slate-100'}
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                mode === 'work'
                  ? (isDark ? 'text-emerald-400' : 'text-emerald-500')
                  : (isDark ? 'text-sky-400' : 'text-sky-500')
              }`}
              style={{ strokeLinecap: 'round' }}
            />
          </svg>
          <div className="text-center z-10">
            <div className={`text-2xl font-bold font-mono tracking-tight leading-none ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className={`text-[10px] mt-1 font-semibold tracking-widest ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {isActive ? 'FLOWING' : 'PAUSED'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleTimer}
          aria-label={isActive ? '暂停番茄钟' : '启动番茄钟'}
          className={`flex-1 max-w-[120px] py-2 px-4 rounded-xl font-bold text-xs tracking-wider transition-all duration-300 shadow-sm cursor-pointer ${
            isActive
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
          }`}
        >
          {isActive ? '暂停' : '开始'}
        </button>
        <button
          onClick={resetTimer}
          aria-label="重置番茄钟"
          className={`p-2 rounded-xl border shadow-sm transition-all duration-300 cursor-pointer ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          title="重置"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}