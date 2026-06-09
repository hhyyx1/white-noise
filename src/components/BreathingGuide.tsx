'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function BreathingGuide() {
  const { isDark } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'ready'>('ready');
  const [secondsLeft, setSecondsLeft] = useState(4); // 默认吸气4秒
  const [cycleCount, setCycleCount] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 监听主题变化事件
  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // 4-7-8 呼吸法周期控制喵
  useEffect(() => {
    if (!isActive) {
      setPhase('ready');
      setSecondsLeft(4);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setPhase('inhale');
    setSecondsLeft(4);

    const runTimer = () => {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // 当前阶段结束，切换到下个阶段
            setPhase(currentPhase => {
              switch (currentPhase) {
                case 'inhale':
                  // 吸气完毕 ➔ 憋气 7 秒
                  setTimeout(() => setSecondsLeft(7), 0);
                  return 'hold';
                case 'hold':
                  // 憋气完毕 ➔ 呼气 8 秒
                  setTimeout(() => setSecondsLeft(8), 0);
                  return 'exhale';
                case 'exhale':
                  // 呼气完毕 ➔ 重新开始吸气 4 秒，循环+1
                  setCycleCount(c => c + 1);
                  setTimeout(() => setSecondsLeft(4), 0);
                  return 'inhale';
                default:
                  return 'ready';
              }
            });
            return 0;
          }
        });
      }, 1000);
    };

    runTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleGuide = () => {
    setIsActive(!isActive);
  };

  const resetGuide = () => {
    setIsActive(false);
    setPhase('ready');
    setSecondsLeft(4);
    setCycleCount(0);
  };

  // 获取当前的阶段提示文字和颜色喵
  const getPhaseInfo = () => {
    switch (phase) {
      case 'inhale':
        return {
          text: '吸气...',
          subText: '缓缓吸入新鲜的空气',
          color: 'text-blue-400',
          bg: 'from-blue-400/20 to-cyan-400/20',
          scale: 1.5,
          duration: 4
        };
      case 'hold':
        return {
          text: '屏息 (憋气)',
          subText: '感受内在力量的平稳',
          color: 'text-purple-400',
          bg: 'from-purple-400/20 to-indigo-400/20',
          scale: 1.5,
          duration: 7
        };
      case 'exhale':
        return {
          text: '呼气...',
          subText: '吐出所有的烦躁与压力',
          color: 'text-green-400',
          bg: 'from-green-400/20 to-emerald-400/20',
          scale: 1.0,
          duration: 8
        };
      default:
        return {
          text: '准备好了吗？',
          subText: '点击开始，进行 4-7-8 呼吸冥想',
          color: isDark ? 'text-slate-300' : 'text-gray-600',
          bg: 'from-slate-400/10 to-slate-400/10',
          scale: 1.0,
          duration: 0
        };
    }
  };

  const info = getPhaseInfo();

  return (
    <motion.div
      key={forceUpdate}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-bento p-5 transition-all duration-300 h-full flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-xl ${
          isDark ? 'bg-sky-950/40 text-sky-400' : 'bg-sky-50 text-sky-600'
        }`}>
          <Wind className="w-4 h-4" />
        </div>
        <h3 className={`text-sm font-bold tracking-wide ${
          isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>呼吸正念</h3>
      </div>

      {/* Breathing Main Animation Section */}
      <div className="flex-1 flex flex-col justify-center items-center relative py-2">
        {/* Breathing Circle Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-1">
          {/* Outer Breathing Glow Circle */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={phase}
              animate={{
                scale: info.scale,
                opacity: phase === 'ready' ? 0.25 : [0.35, 0.65, 0.35]
              }}
              transition={{
                scale: { duration: phase === 'hold' ? 0 : info.duration, ease: 'easeInOut' },
                opacity: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
              }}
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${info.bg} blur-md`}
            />
          </AnimatePresence>

          {/* Inner Core Circle */}
          <motion.div
            animate={{
              scale: info.scale
            }}
            transition={{
              duration: phase === 'hold' ? 0 : info.duration,
              ease: 'easeInOut'
            }}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center border shadow-inner transition-colors duration-500 ${
              isDark
                ? 'bg-slate-950/80 border-slate-700/50'
                : 'bg-white/80 border-gray-100'
            }`}
          >
            {phase !== 'ready' ? (
              <span className={`text-lg font-bold font-mono ${info.color}`}>
                {secondsLeft}
              </span>
            ) : (
              <Wind className={`w-5 h-5 opacity-65 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
            )}
          </motion.div>
        </div>

        {/* Phase Text Labels */}
        <div className="text-center h-10 mt-1">
          <h4 className={`text-sm font-extrabold transition-colors duration-500 ${info.color}`}>
            {info.text}
          </h4>
          <p className={`text-[10px] mt-0.5 max-w-[200px] mx-auto leading-tight transition-colors duration-300 font-medium ${
            isDark ? 'text-slate-400' : 'text-gray-500'
          }`}>
            {info.subText}
          </p>
        </div>
      </div>

      {/* Controls & Mini Info */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-slate-400/10">
        <span className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
          已呼吸: <strong className="font-mono text-xs">{cycleCount}</strong> 轮次
        </span>

        <div className="flex gap-1.5">
          <button
            onClick={toggleGuide}
            aria-label={isActive ? '暂停呼吸引导' : '启动呼吸引导'}
            className={`p-1.5 rounded-xl transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
            }`}
            title={isActive ? '暂停' : '开始'}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={resetGuide}
            aria-label="重置呼吸引导"
            className={`p-1.5 rounded-xl border shadow-sm transition-all duration-300 cursor-pointer ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
            title="重置"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
