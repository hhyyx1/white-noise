'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StopCircle, Volume2, VolumeX, RotateCcw, Moon, ChevronUp, ChevronDown } from 'lucide-react';
import { getSoundDisplayName } from '@/data/sounds';
import { useTheme } from '@/hooks/useTheme';

interface GlobalControlsProps {
  playingSounds: string[];
  onStopAll: () => void;
  onMasterVolumeChange: (volume: number) => void;
  masterVolume: number;
  // 睡眠定时器相关 Props 喵
  sleepTimeLeft: number | null;
  sleepTimerActive: boolean;
  onStartSleepTimer: (minutes: number) => void;
  onStopSleepTimer: () => void;
}

export const GlobalControls = ({
  playingSounds,
  onStopAll,
  onMasterVolumeChange,
  masterVolume,
  sleepTimeLeft,
  sleepTimerActive,
  onStartSleepTimer,
  onStopSleepTimer
}: GlobalControlsProps) => {
  const { isDark } = useTheme();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 监听主题变化事件
  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const sleepOptions = [15, 30, 45, 60, 90];

  if (playingSounds.length === 0) return null;

  return (
    <motion.div
      key={forceUpdate}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      className={`fixed left-3 right-3 bottom-3 md:left-auto md:right-6 md:bottom-6 md:w-[320px] z-40 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
        isDark
          ? 'bg-slate-950/75 text-slate-200 border-slate-800/60 shadow-black/30'
          : 'bg-white/82 text-slate-800 border-white/70 shadow-slate-200/60'
      }`}
    >
      <div className="p-3 sm:p-4">
        {/* Dock Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-2.5 h-2.5 shrink-0">
              <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-60" />
              <span className="absolute inset-0 bg-emerald-500 rounded-full" />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-black tracking-wide truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {playingSounds.length} 个音景播放中
              </p>
              <p className={`text-[10px] font-bold tracking-wider truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                AMBIENT DOCK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? '收起播放控制台' : '展开播放控制台'}
              className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-2xl transition-colors cursor-pointer ${
                isDark ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={onStopAll}
              aria-label="停止所有声音"
              className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-2xl transition-colors cursor-pointer ${
                isDark
                  ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-900/30'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'
              }`}
              title="停止所有声音"
            >
              <StopCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Always-visible master volume */}
        <div className={`mt-3 p-2.5 rounded-2xl border ${
          isDark ? 'bg-slate-900/55 border-slate-800/50' : 'bg-slate-50/80 border-slate-100'
        }`}>
          <div className="flex items-center gap-3 min-h-[44px]">
            <VolumeX className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              aria-label="主音量"
              onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
              className="w-full cursor-pointer slider"
            />
            <Volume2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              {/* Sleep Timer */}
              <div className={`mt-3 p-3 rounded-2xl border relative transition-colors duration-300 ${
                isDark ? 'bg-slate-900/45 border-slate-800/50' : 'bg-white/70 border-slate-100'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setShowSleepMenu(!showSleepMenu)}
                    aria-label="设置睡眠定时"
                    className={`min-h-[44px] flex items-center gap-2 text-xs font-bold cursor-pointer transition-colors text-left ${
                      sleepTimerActive
                        ? 'text-emerald-500'
                        : (isDark ? 'text-slate-300 hover:text-slate-100' : 'text-slate-600 hover:text-slate-800')
                    }`}
                  >
                    <Moon className="w-4 h-4 shrink-0" />
                    {sleepTimerActive && sleepTimeLeft !== null ? (
                      <span>睡眠倒计时 <strong className="font-mono">{formatTime(sleepTimeLeft)}</strong></span>
                    ) : (
                      <span>睡眠定时</span>
                    )}
                  </button>

                  {sleepTimerActive && (
                    <button
                      onClick={onStopSleepTimer}
                      className="min-h-[36px] px-3 rounded-xl bg-rose-400/12 hover:bg-rose-400/20 text-rose-500 text-xs font-bold transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {showSleepMenu && !sleepTimerActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="grid grid-cols-5 gap-2 pt-2 border-t border-dashed border-slate-400/20">
                        {sleepOptions.map((mins) => (
                          <button
                            key={mins}
                            onClick={() => {
                              onStartSleepTimer(mins);
                              setShowSleepMenu(false);
                            }}
                            className={`min-h-[36px] text-[10px] font-black rounded-xl transition-all cursor-pointer ${
                              isDark
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/40'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Playing Sounds List */}
              <div className="mt-3 space-y-1.5">
                <div className={`text-[10px] font-black tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>正在播放</div>
                <div className="flex flex-wrap gap-1.5 max-h-[78px] overflow-y-auto pr-1">
                  {playingSounds.map((soundId) => (
                    <span
                      key={soundId}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isDark
                          ? 'bg-emerald-950/35 text-emerald-300 border border-emerald-900/20'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {getSoundDisplayName(soundId)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={onStopAll}
                  className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3 rounded-2xl transition-colors text-xs font-black cursor-pointer ${
                    isDark
                      ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-900/30'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100'
                  }`}
                >
                  <StopCircle className="w-4 h-4" />
                  停止全部
                </button>
                <button
                  onClick={() => onMasterVolumeChange(0.5)}
                  className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800/50'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                  title="重置音量"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
