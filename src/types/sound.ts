export type SoundIconKey =
  | 'cloud'
  | 'waves'
  | 'coffee'
  | 'tree-pine'
  | 'zap'
  | 'wind'
  | 'bird'
  | 'flame';

export interface SoundItem {
  id: string;
  name: string;
  icon: SoundIconKey;
  color: string;
  description: string;
  audioUrl: string;
}

export interface SoundPreset {
  id: string;
  name: string;
  description: string;
  sounds: Array<{
    id: string;
    volume: number;
  }>;
  gradient: string;
}
