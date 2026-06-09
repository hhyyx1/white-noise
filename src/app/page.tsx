'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Cloud,
  Waves,
  Coffee,
  TreePine,
  Zap,
  Wind,
  Bird,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useTheme } from '@/hooks/useTheme';
import { SOUNDS } from '@/data/sounds';
import type { SoundPreset } from '@/types/sound';
import { GlobalControls } from '@/components/GlobalControls';
import { SoundPresets } from '@/components/SoundPresets';
import { HelpPanel } from '@/components/HelpPanel';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { DigitalWoodenFish } from '@/components/DigitalWoodenFish';
import { AnimatedScene } from '@/components/AnimatedScene';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Modal } from '@/components/Modal';
import { AboutUs } from '@/components/AboutUs';
import { TermsOfService } from '@/components/TermsOfService';
import { PrivacyPolicy } from '@/components/PrivacyPolicy';
import { BreathingGuide } from '@/components/BreathingGuide';

const soundIcons = {
  cloud: Cloud,
  waves: Waves,
  coffee: Coffee,
  'tree-pine': TreePine,
  zap: Zap,
  wind: Wind,
  bird: Bird,
  flame: Flame
};

export default function Home() {
  const {
    toggleSound,
    adjustVolume,
    stopAllSounds,
    isPlaying,
    getVolume,
    getPlayingSounds,
    setMasterVolumeLevel,
    masterVolume,
    applyPreset,
    isPresetActive,
    sleepTimeLeft,
    sleepTimerActive,
    startSleepTimer,
    stopSleepTimer
  } = useAudioManager();

  const { toggleTheme, autoSwitchTheme, isDark, toggleMode, isAutoMode } = useTheme();
  const [forceUpdate, setForceUpdate] = useState(0);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'about' | 'terms' | 'privacy' | null;
  }>({
    isOpen: false,
    type: null
  });

  const playingSounds = getPlayingSounds();

  useEffect(() => {
    if (!isAutoMode) return;
    autoSwitchTheme();
    const interval = setInterval(() => {
      autoSwitchTheme();
    }, 60000);
    return () => clearInterval(interval);
  }, [autoSwitchTheme, isAutoMode]);

  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const handleApplyPreset = async (preset: SoundPreset) => {
    if (isPresetActive(preset)) {
      stopAllSounds();
    } else {
      await applyPreset(preset);
    }
  };

  const handleMasterVolumeUp = () => {
    const newVolume = Math.min(1, masterVolume + 0.1);
    setMasterVolumeLevel(newVolume);
  };

  const handleMasterVolumeDown = () => {
    const newVolume = Math.max(0, masterVolume - 0.1);
    setMasterVolumeLevel(newVolume);
  };

  const handleToggleSound = (soundId: string) => {
    const sound = SOUNDS.find(s => s.id === soundId);
    if (sound) {
      toggleSound(soundId);
    }
  };

  const openModal = (type: 'about' | 'terms' | 'privacy') => {
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  const getModalTitle = () => {
    switch (modalState.type) {
      case 'about':
        return '关于我们';
      case 'terms':
        return '使用条款';
      case 'privacy':
        return '隐私政策';
      default:
        return '';
    }
  };

  const getModalContent = () => {
    switch (modalState.type) {
      case 'about':
        return <AboutUs />;
      case 'terms':
        return <TermsOfService />;
      case 'privacy':
        return <PrivacyPolicy />;
      default:
        return null;
    }
  };

  useKeyboardShortcuts({
    onStopAll: stopAllSounds,
    onToggleSound: handleToggleSound,
    onMasterVolumeUp: handleMasterVolumeUp,
    onMasterVolumeDown: handleMasterVolumeDown
  });

  return (
    <div className={`min-h-screen transition-all duration-500 overflow-x-hidden ${
      isDark ? 'text-slate-200' : 'text-slate-800'
    }`}>
      {/* Help Panel */}
      <HelpPanel />

      {/* Background Animated Gradient Lights (Zen Fluid Ambient Spec) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.15, 0.9, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className={`absolute w-[450px] h-[450px] rounded-full blur-[140px] opacity-25 -top-20 -left-20 ${
            isDark ? 'bg-emerald-500/20' : 'bg-emerald-300/30'
          }`}
        />
        <motion.div
          animate={{
            x: [0, -120, 60, 0],
            y: [0, 100, -80, 0],
            scale: [1, 0.9, 1.2, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className={`absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-20 -bottom-40 -right-40 ${
            isDark ? 'bg-sky-500/15' : 'bg-sky-300/25'
          }`}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header - Advanced Elegant Typography & Alignment */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6"
        >
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
              isDark
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-950/20'
                : 'bg-white text-emerald-600 border border-slate-100 shadow-slate-100/50'
            }`}>
              <Cloud className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className={`text-2xl font-black tracking-tight font-sans ${
                isDark
                  ? 'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent'
                  : 'text-slate-800'
              }`}>
                泡泡白噪音 <span className="text-xs font-bold text-emerald-500 tracking-normal px-2 py-0.5 rounded-full bg-emerald-500/10 ml-1">ZEN 2.0</span>
              </h1>
              <p className={`text-xs font-medium tracking-wide mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                让声音带你远离喧嚣，找到内心的宁静 · 模块化正念室
              </p>
            </div>
          </div>

          {/* Controls Capsule Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 border font-semibold text-xs tracking-wider cursor-pointer ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800/40 text-slate-300 hover:text-slate-100'
                  : 'bg-white/80 border-slate-100 text-slate-600 hover:text-slate-800 shadow-sm'
              }`}
              title={isAutoMode ? '切换到手动模式' : '切换到自动模式'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAutoMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isAutoMode ? '智能自适应' : '手动调节'}
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 border cursor-pointer ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800/40 text-yellow-400 hover:bg-slate-800/80 hover:text-yellow-300'
                  : 'bg-white/80 border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
              }`}
              title={isDark ? '切换到白天模式' : '切换到夜间模式'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </motion.header>

        {/* Main Bento Grid Layout - Exactly aligning components for high-end aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-10 items-stretch">
          {/* Bento Cell 1: Pomodoro Focus (Col 4) */}
          <div className="lg:col-span-4 h-[350px]">
            <PomodoroTimer />
          </div>

          {/* Bento Cell 2: Breathing正念 (Col 4) */}
          <div className="lg:col-span-4 h-[350px]">
            <BreathingGuide />
          </div>

          {/* Bento Cell 3: Live Ambient Windows (Col 4) */}
          <div className="lg:col-span-4 h-[350px]">
            <AnimatedScene />
          </div>
        </div>

        {/* Floating Mini Zen Tool: Digital Wooden Fish (Full width bento footer item) */}
        <div className="grid grid-cols-1 gap-5 mb-10">
          <div className="h-[220px] w-full">
            <DigitalWoodenFish />
          </div>
        </div>

        {/* Sound Presets - Integrated elegantly into flow */}
        <SoundPresets
          onApplyPreset={handleApplyPreset}
          isPresetActive={isPresetActive}
        />

        {/* Sound Grid - dense but touch-friendly mixer tiles */}
        <section className="mb-16">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                声音调音台
              </h2>
              <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                轻触开启音景，保持卡片密度与统一玻璃质感
              </p>
            </div>
            <span className={`hidden sm:inline-flex text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border ${
              isDark ? 'text-slate-500 border-slate-800 bg-slate-950/30' : 'text-slate-400 border-slate-200 bg-white/50'
            }`}>
              MIXER
            </span>
          </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-16">
          {SOUNDS.map((sound, index) => {
            const Icon = soundIcons[sound.icon];
            const active = isPlaying(sound.id);

            return (
            <motion.div
              key={sound.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="group"
            >
              <div
                key={`${sound.id}-${forceUpdate}`}
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-5 shadow-sm card-hover backdrop-blur-md transition-all duration-500 min-h-[150px] sm:min-h-[170px] h-full flex flex-col justify-between ${
                  active
                    ? (isDark ? 'aurora-active-dark border-emerald-500/20 shadow-lg shadow-emerald-950/10' : 'aurora-active-light border-emerald-300/40 shadow-lg shadow-emerald-100/30')
                    : (isDark ? 'bg-slate-900/40 border-slate-800/40' : 'bg-white/80 border-slate-100/80')
                }`}
              >
                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                      active
                        ? (isDark ? 'bg-emerald-950/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                        : (isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-400')
                    }`}>
                      <Icon className={`w-5 h-5 ${active ? 'breathe' : ''}`} />
                    </div>
                    <button
                      onClick={() => toggleSound(sound.id)}
                      aria-label={`切换${sound.name}`}
                      className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                        active
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105'
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

                  <h3 className={`text-[15px] sm:text-base font-extrabold mb-1 transition-colors duration-300 ${
                    active
                      ? (isDark ? 'text-emerald-300' : 'text-emerald-800')
                      : (isDark ? 'text-slate-200' : 'text-slate-800')
                  }`}>
                    {sound.name}
                  </h3>
                  <p className={`text-[11px] leading-relaxed transition-colors duration-300 font-medium clamp-2 ${
                    active
                      ? (isDark ? 'text-slate-300/90' : 'text-emerald-700/90')
                      : (isDark ? 'text-slate-400' : 'text-slate-500')
                  }`}>
                    {sound.description}
                  </p>
                </div>

                {/* Volume Control */}
                <div className="h-11 mt-3 flex items-end">
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className={`flex items-center gap-2.5 p-2 rounded-xl w-full min-h-[44px] transition-colors duration-300 ${
                          isDark ? 'bg-slate-950/40' : 'bg-slate-50/80'
                        }`}
                      >
                        <VolumeX className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-emerald-700/60'}`} />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={getVolume(sound.id)}
                          aria-label={`${sound.name}音量`}
                          onChange={(e) => adjustVolume(sound.id, parseFloat(e.target.value))}
                          className="flex-1 cursor-pointer slider"
                        />
                        <Volume2 className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-emerald-600'}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
        </section>

        {/* Global Controls - Floating Action Console */}
        <GlobalControls
          playingSounds={playingSounds}
          onStopAll={stopAllSounds}
          onMasterVolumeChange={setMasterVolumeLevel}
          masterVolume={masterVolume}
          sleepTimeLeft={sleepTimeLeft}
          sleepTimerActive={sleepTimerActive}
          onStartSleepTimer={startSleepTimer}
          onStopSleepTimer={stopSleepTimer}
        />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className={`backdrop-blur-md rounded-3xl p-8 mx-auto max-w-2xl border ${
            isDark ? 'bg-slate-950/40 border-slate-800/40 text-slate-400' : 'bg-white/40 border-white/60 text-slate-600'
          }`}>
            <p className="mb-6 text-base font-extrabold tracking-wide">
              让声音带你远离喧嚣，找到内心的宁静 🌸
            </p>
            <div className="flex justify-center gap-8 text-xs font-bold">
              <button
                onClick={() => openModal('about')}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-600'
                }`}
              >
                关于我们
              </button>
              <button
                onClick={() => openModal('terms')}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-600'
                }`}
              >
                使用条款
              </button>
              <button
                onClick={() => openModal('privacy')}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-600'
                }`}
              >
                隐私政策
              </button>
            </div>
            <div className={`mt-6 text-[10px] font-bold tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              © 2026 泡泡白噪音 · 专注与放松的一站式平台
            </div>
          </div>
        </motion.footer>
      </div>

      {/* 模态框 */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={getModalTitle()}
      >
        {getModalContent()}
      </Modal>
    </div>
  );
}