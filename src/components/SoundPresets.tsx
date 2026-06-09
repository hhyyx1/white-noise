'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { SOUND_PRESETS, getSoundDisplayName } from '@/data/sounds';
import { useTheme } from '@/hooks/useTheme';
import type { SoundPreset } from '@/types/sound';

interface SoundPresetsProps {
  onApplyPreset: (preset: SoundPreset) => void;
  isPresetActive: (preset: SoundPreset) => boolean;
}

export const SoundPresets = ({ onApplyPreset, isPresetActive }: SoundPresetsProps) => {
  const { isDark } = useTheme();
  const [forceUpdate, setForceUpdate] = useState(0);

  // 监听主题变化事件
  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between mb-5 gap-4"
      >
        <div>
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            精选组合
          </h2>
          <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            统一为玻璃拟态音景胶囊，避免与整体视觉割裂
          </p>
        </div>
        <span className={`hidden sm:inline-flex text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border ${
          isDark ? 'text-slate-500 border-slate-800 bg-slate-950/30' : 'text-slate-400 border-slate-200 bg-white/50'
        }`}>
          SOUND MOODS
        </span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {SOUND_PRESETS.map((preset, index) => {
          const active = isPresetActive(preset);

          return (
          <motion.div
            key={preset.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="group"
          >
            <div
              key={`${preset.id}-${forceUpdate}`}
              className={`relative overflow-hidden rounded-3xl border p-4 shadow-sm card-hover backdrop-blur-md transition-all duration-500 h-full ${
                active
                  ? (isDark ? 'aurora-active-dark border-emerald-500/20 shadow-emerald-950/10' : 'aurora-active-light border-emerald-300/40 shadow-emerald-100/30')
                  : (isDark ? 'bg-slate-900/40 border-slate-800/40' : 'bg-white/75 border-slate-100/80')
              }`}
            >
              {/* subtle unified accent, not a full colored card */}
              <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full blur-2xl opacity-20 ${
                active ? 'bg-emerald-400' : (isDark ? 'bg-slate-600' : 'bg-emerald-200')
              }`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className={`w-1.5 h-1.5 rounded-full mb-2 ${active ? 'bg-emerald-400 animate-pulse' : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                    <h3 className={`text-sm font-black leading-tight transition-colors duration-300 ${
                      active
                        ? (isDark ? 'text-emerald-300' : 'text-emerald-800')
                        : (isDark ? 'text-slate-200' : 'text-slate-800')
                    }`}>
                      {preset.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => onApplyPreset(preset)}
                    aria-label={`应用预设${preset.name}`}
                    className={`shrink-0 p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                      active
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700/60 border border-slate-700/30'
                          : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-sm border border-slate-200/80'
                    }`}
                  >
                    {active ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className={`text-[11px] mb-3 leading-relaxed font-medium transition-colors duration-300 ${
                  active
                    ? (isDark ? 'text-slate-300/90' : 'text-emerald-700/90')
                    : (isDark ? 'text-slate-400' : 'text-slate-500')
                }`}>
                  {preset.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-auto">
                  {preset.sounds.map((sound) => (
                    <span
                      key={sound.id}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors duration-300 ${
                        active
                          ? (isDark ? 'bg-emerald-950/40 text-emerald-300' : 'bg-emerald-100/60 text-emerald-700')
                          : (isDark ? 'bg-slate-800/70 text-slate-400' : 'bg-slate-100/80 text-slate-500')
                      }`}
                    >
                      {getSoundDisplayName(sound.id)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export type { SoundPreset };
