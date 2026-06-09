import type { SoundItem, SoundPreset } from '@/types/sound';

export const SOUNDS: SoundItem[] = [
  {
    id: 'rain-gentle',
    name: '温柔雨声',
    icon: 'cloud',
    color: 'from-blue-100 to-blue-200 border-blue-300',
    description: '一场温柔的雨，带来内心的宁静',
    audioUrl: '/gentle-rain.wav'
  },
  {
    id: 'rain-chill',
    name: '悠闲雨声',
    icon: 'cloud',
    color: 'from-slate-100 to-slate-200 border-slate-300',
    description: '放松的雨声，适合冥想和专注',
    audioUrl: '/chill-rain-patreon-sample-364447.mp3'
  },
  {
    id: 'rain-window',
    name: '窗边雨滴',
    icon: 'cloud',
    color: 'from-gray-100 to-gray-200 border-gray-300',
    description: '雨滴敲打窗户的声音',
    audioUrl: '/rain-drops-on-window-green-noise-mix-231100.mp3'
  },
  {
    id: 'rain-soft',
    name: '轻柔雨声',
    icon: 'cloud',
    color: 'from-indigo-100 to-indigo-200 border-indigo-300',
    description: '柔和的雨声，营造宁静氛围',
    audioUrl: '/lluvia-suave-314513.mp3'
  },
  {
    id: 'rain-surfaces',
    name: '多重雨声',
    icon: 'cloud',
    color: 'from-teal-100 to-teal-200 border-teal-300',
    description: '雨滴落在不同表面的丰富音效',
    audioUrl: '/raining-on-multiple-surfaces-mix-231892.mp3'
  },
  {
    id: 'coffee-shop',
    name: '温馨咖啡厅',
    icon: 'coffee',
    color: 'from-amber-100 to-amber-200 border-amber-300',
    description: '真实的咖啡厅环境音',
    audioUrl: '/coffee.mp3'
  },
  {
    id: 'ocean',
    name: '海浪',
    icon: 'waves',
    color: 'from-cyan-100 to-cyan-200 border-cyan-300',
    description: '海浪拍打海岸的自然节奏',
    audioUrl: 'generated'
  },
  {
    id: 'forest',
    name: '森林',
    icon: 'tree-pine',
    color: 'from-green-100 to-green-200 border-green-300',
    description: '森林中的鸟鸣和风声',
    audioUrl: 'generated'
  },
  {
    id: 'thunder',
    name: '雷声',
    icon: 'zap',
    color: 'from-purple-100 to-purple-200 border-purple-300',
    description: '远处的雷声，营造戏剧氛围',
    audioUrl: 'generated'
  },
  {
    id: 'wind',
    name: '风声',
    icon: 'wind',
    color: 'from-gray-100 to-gray-200 border-gray-300',
    description: '轻柔的风声，带来平静',
    audioUrl: 'generated'
  },
  {
    id: 'birds',
    name: '鸟鸣',
    icon: 'bird',
    color: 'from-yellow-100 to-yellow-200 border-yellow-300',
    description: '清晨的鸟儿歌声',
    audioUrl: 'generated'
  },
  {
    id: 'fire',
    name: '篝火',
    icon: 'flame',
    color: 'from-red-100 to-red-200 border-red-300',
    description: '温暖篝火的噼啪声',
    audioUrl: 'generated'
  }
];

export const EXTRA_AUDIO_SOURCES: Record<string, string> = {
  'rain-ambient1': '/637b512d6d3cf237.mp3',
  'rain-ambient2': '/63bfb65f91fc7348.mp3',
  'rain-ambient3': '/VCG231106751.mp3'
};

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'gentle-rain',
    name: '温柔雨声',
    description: '一场温柔的雨，带来内心的宁静',
    sounds: [{ id: 'rain-gentle', volume: 0.8 }],
    gradient: 'from-blue-100 to-gray-100 border-blue-300'
  },
  {
    id: 'cozy-cafe',
    name: '温馨咖啡厅',
    description: '真实的咖啡厅环境音',
    sounds: [{ id: 'coffee-shop', volume: 0.7 }],
    gradient: 'from-amber-100 to-orange-100 border-amber-300'
  },
  {
    id: 'rainy-cafe',
    name: '雨天咖啡厅',
    description: '温暖的咖啡厅配上窗外的雨声',
    sounds: [
      { id: 'rain-window', volume: 0.6 },
      { id: 'coffee-shop', volume: 0.5 }
    ],
    gradient: 'from-amber-100 to-blue-100 border-amber-300'
  },
  {
    id: 'chill-rain',
    name: '悠闲雨声',
    description: '放松的雨声，适合冥想和专注',
    sounds: [{ id: 'rain-chill', volume: 0.8 }],
    gradient: 'from-slate-100 to-blue-100 border-slate-300'
  },
  {
    id: 'window-rain',
    name: '窗边雨滴',
    description: '雨滴敲打窗户的声音',
    sounds: [{ id: 'rain-window', volume: 0.8 }],
    gradient: 'from-gray-100 to-blue-100 border-gray-300'
  },
  {
    id: 'soft-rain',
    name: '轻柔雨声',
    description: '柔和的雨声，营造宁静氛围',
    sounds: [{ id: 'rain-soft', volume: 0.8 }],
    gradient: 'from-indigo-100 to-blue-100 border-indigo-300'
  },
  {
    id: 'rain-surfaces',
    name: '多重雨声',
    description: '雨滴落在不同表面的丰富音效',
    sounds: [{ id: 'rain-surfaces', volume: 0.8 }],
    gradient: 'from-teal-100 to-blue-100 border-teal-300'
  },
  {
    id: 'forest-storm',
    name: '森林雷雨',
    description: '森林中的雷雨天气',
    sounds: [
      { id: 'forest', volume: 0.5 },
      { id: 'thunder', volume: 0.3 },
      { id: 'rain-ambient1', volume: 0.7 }
    ],
    gradient: 'from-green-100 to-purple-100 border-green-300'
  },
  {
    id: 'ocean-breeze',
    name: '海边微风',
    description: '海浪声配上轻柔的风声',
    sounds: [
      { id: 'ocean', volume: 0.8 },
      { id: 'wind', volume: 0.4 }
    ],
    gradient: 'from-cyan-100 to-blue-100 border-cyan-300'
  },
  {
    id: 'campfire-night',
    name: '篝火夜晚',
    description: '篝火旁的宁静夜晚',
    sounds: [
      { id: 'fire', volume: 0.7 },
      { id: 'wind', volume: 0.3 },
      { id: 'forest', volume: 0.2 }
    ],
    gradient: 'from-orange-100 to-red-100 border-orange-300'
  },
  {
    id: 'morning-birds',
    name: '晨间鸟鸣',
    description: '清晨的鸟儿歌声和森林声音',
    sounds: [
      { id: 'birds', volume: 0.8 },
      { id: 'forest', volume: 0.5 },
      { id: 'wind', volume: 0.2 }
    ],
    gradient: 'from-yellow-100 to-green-100 border-yellow-300'
  },
  {
    id: 'ambient-rain-mix',
    name: '环境雨声混合',
    description: '多种雨声的完美融合',
    sounds: [
      { id: 'rain-ambient2', volume: 0.6 },
      { id: 'rain-ambient3', volume: 0.4 }
    ],
    gradient: 'from-purple-100 to-blue-100 border-purple-300'
  },
  {
    id: 'cafe-gentle-rain',
    name: '咖啡厅温柔雨',
    description: '温馨咖啡厅配上温柔的雨声',
    sounds: [
      { id: 'coffee-shop', volume: 0.6 },
      { id: 'rain-gentle', volume: 0.5 }
    ],
    gradient: 'from-amber-100 to-slate-100 border-amber-300'
  },
  {
    id: 'cafe-soft-rain',
    name: '咖啡厅轻柔雨',
    description: '咖啡厅与轻柔雨声的完美结合',
    sounds: [
      { id: 'coffee-shop', volume: 0.7 },
      { id: 'rain-soft', volume: 0.4 }
    ],
    gradient: 'from-orange-100 to-indigo-100 border-orange-300'
  },
  {
    id: 'cafe-chill-rain',
    name: '咖啡厅悠闲雨',
    description: '在咖啡厅享受悠闲的雨天时光',
    sounds: [
      { id: 'coffee-shop', volume: 0.5 },
      { id: 'rain-chill', volume: 0.6 }
    ],
    gradient: 'from-yellow-100 to-slate-100 border-yellow-300'
  }
];

export const getSoundAudioUrl = (soundId: string) => {
  return SOUNDS.find(sound => sound.id === soundId)?.audioUrl ?? EXTRA_AUDIO_SOURCES[soundId] ?? 'generated';
};

export const getSoundDisplayName = (soundId: string) => {
  return SOUNDS.find(sound => sound.id === soundId)?.name ?? {
    'rain-ambient1': '环境雨声1',
    'rain-ambient2': '环境雨声2',
    'rain-ambient3': '环境雨声3',
    rain: '雨声',
    coffee: '咖啡厅'
  }[soundId] ?? soundId;
};

export const getKeyboardShortcutSounds = () => SOUNDS.slice(0, 8);
