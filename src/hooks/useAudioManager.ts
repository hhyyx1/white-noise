import { useState, useCallback, useEffect, useRef } from 'react';
import { getAudioGenerator } from '@/utils/audioGenerator';

interface AudioState {
  isPlaying: boolean;
  volume: number;
}

export const useAudioManager = () => {
  const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({});
  const [masterVolume, setMasterVolume] = useState(0.6); // Lower default master volume
  const [sleepTimeLeft, setSleepTimeLeft] = useState<number | null>(null); // 睡眠倒计时(秒)
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const audioGenerator = getAudioGenerator();
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Basic functions first
  const getPlayingSounds = useCallback(() => {
    return Object.entries(audioStates)
      .filter(([, state]) => state.isPlaying)
      .map(([soundId]) => soundId);
  }, [audioStates]);

  const isPlaying = useCallback((soundId: string) => {
    return audioStates[soundId]?.isPlaying || false;
  }, [audioStates]);

  const getVolume = useCallback((soundId: string) => {
    return audioStates[soundId]?.volume || 0.3;
  }, [audioStates]);

  const stopAllSounds = useCallback(() => {
    audioGenerator.stopAll();

    setAudioStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(soundId => {
        newStates[soundId] = {
          ...newStates[soundId],
          isPlaying: false
        };
      });
      return newStates;
    });
  }, [audioGenerator]);

  const toggleSound = useCallback(async (soundId: string) => {
    const currentState = audioStates[soundId];
    const isCurrentlyPlaying = currentState?.isPlaying || false;

    if (isCurrentlyPlaying) {
      // Stop the sound smoothly
      audioGenerator.stopSound(soundId, 0.3);

      setAudioStates(prev => ({
        ...prev,
        [soundId]: {
          ...prev[soundId],
          isPlaying: false
        }
      }));
    } else {
      // Start the sound
      try {
        await audioGenerator.startSound(soundId);

        // Set initial volume (lower default)
        const volume = currentState?.volume || 0.3;
        audioGenerator.setVolume(soundId, volume * masterVolume, 0.3);

        setAudioStates(prev => ({
          ...prev,
          [soundId]: {
            isPlaying: true,
            volume
          }
        }));
      } catch (error) {
        console.error(`Error playing ${soundId}:`, error);
      }
    }
  }, [audioStates, audioGenerator, masterVolume]);

  const adjustVolume = useCallback((soundId: string, volume: number) => {
    const finalVolume = volume * masterVolume;
    audioGenerator.setVolume(soundId, finalVolume, 0.15);

    setAudioStates(prev => ({
      ...prev,
      [soundId]: {
        ...prev[soundId],
        volume
      }
    }));
  }, [audioGenerator, masterVolume]);

  const setMasterVolumeLevel = useCallback((volume: number) => {
    setMasterVolume(volume);

    // Update all currently playing sounds with new master volume
    Object.entries(audioStates).forEach(([soundId, state]) => {
      if (state.isPlaying) {
        const finalVolume = state.volume * volume;
        audioGenerator.setVolume(soundId, finalVolume, 0.2);
      }
    });
  }, [audioGenerator, audioStates]);

  const applyPreset = useCallback(async (preset: { sounds: Array<{ id: string; volume: number }> }) => {
    // Stop all current sounds first smoothly
    // Wait a bit for sounds to fade out
    Object.keys(audioStates).forEach(id => {
      if (audioStates[id]?.isPlaying) {
        audioGenerator.stopSound(id, 0.2);
      }
    });

    setAudioStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(soundId => {
        newStates[soundId] = { ...newStates[soundId], isPlaying: false };
      });
      return newStates;
    });

    await new Promise(resolve => setTimeout(resolve, 200));

    // Start each sound in the preset
    for (const sound of preset.sounds) {
      try {
        await audioGenerator.startSound(sound.id);
        const finalVolume = sound.volume * masterVolume;
        audioGenerator.setVolume(sound.id, finalVolume, 0.3);

        setAudioStates(prev => ({
          ...prev,
          [sound.id]: {
            isPlaying: true,
            volume: sound.volume
          }
        }));
      } catch (error) {
        console.error(`Error starting preset sound ${sound.id}:`, error);
      }
    }
  }, [audioGenerator, masterVolume, audioStates]);

  const isPresetActive = useCallback((preset: { sounds: Array<{ id: string; volume: number }> }) => {
    const playingSounds = getPlayingSounds();
    const presetSoundIds = preset.sounds.map(s => s.id);

    // Check if all preset sounds are playing and no extra sounds
    return presetSoundIds.length === playingSounds.length &&
           presetSoundIds.every(id => playingSounds.includes(id));
  }, [getPlayingSounds]);

  // --- 睡眠倒计时 & 渐隐逻辑喵 ---

  // 开启倒计时
  const startSleepTimer = useCallback((minutes: number) => {
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    if (fadeOutIntervalRef.current) clearInterval(fadeOutIntervalRef.current);

    setSleepTimeLeft(minutes * 60);
    setSleepTimerActive(true);
  }, []);

  // 停止倒计时
  const stopSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (fadeOutIntervalRef.current) {
      clearInterval(fadeOutIntervalRef.current);
      fadeOutIntervalRef.current = null;
    }
    setSleepTimeLeft(null);
    setSleepTimerActive(false);
  }, []);

  // 倒计时核心计时器
  useEffect(() => {
    if (sleepTimerActive && sleepTimeLeft !== null) {
      if (sleepTimeLeft > 0) {
        sleepTimerRef.current = setTimeout(() => {
          setSleepTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
      } else {
        // 时间到！执行 5 秒钟平滑淡出 (Fade-out)
        setSleepTimerActive(false);
        const steps = 50; // 5秒内调整50次
        let currentStep = 0;
        const initialMasterVolume = masterVolume;

        fadeOutIntervalRef.current = setInterval(() => {
          currentStep++;
          const ratio = (steps - currentStep) / steps;
          const tempVolume = initialMasterVolume * ratio;

          // 平缓调低主音量
          setMasterVolume(tempVolume);
          Object.entries(audioStates).forEach(([soundId, state]) => {
            if (state.isPlaying) {
              audioGenerator.setVolume(soundId, state.volume * tempVolume, 0.1);
            }
          });

          if (currentStep >= steps) {
            if (fadeOutIntervalRef.current) clearInterval(fadeOutIntervalRef.current);
            stopAllSounds();
            // 恢复原本的主音量，保证下次播放时正常
            setMasterVolume(initialMasterVolume);
            setSleepTimeLeft(null);
          }
        }, 100); // 每 100ms 降一次，极致丝滑
      }
    }

    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [sleepTimerActive, sleepTimeLeft, masterVolume, audioStates, audioGenerator, stopAllSounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioGenerator.stopAll();
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
      if (fadeOutIntervalRef.current) clearInterval(fadeOutIntervalRef.current);
    };
  }, [audioGenerator]);

  return {
    toggleSound,
    adjustVolume,
    stopAllSounds,
    getPlayingSounds,
    isPlaying,
    getVolume,
    setMasterVolumeLevel,
    masterVolume,
    applyPreset,
    isPresetActive,
    audioStates,
    // 睡眠定时器接口喵
    sleepTimeLeft,
    sleepTimerActive,
    startSleepTimer,
    stopSleepTimer
  };
};
