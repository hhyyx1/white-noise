// Audio generator for creating realistic white noise and nature sounds

import { getSoundAudioUrl } from '@/data/sounds';

export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private activeNodes: Map<string, {
    sources: AudioBufferSourceNode[];
    gainNode: GainNode;
    filters: BiquadFilterNode[];
    audioElement?: HTMLAudioElement;
  }> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();


  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) return null;
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  private async loadAudioFile(url: string): Promise<AudioBuffer> {
    if (this.audioBuffers.has(url)) {
      return this.audioBuffers.get(url)!;
    }

    const context = await this.ensureAudioContext();
    if (!context) throw new Error('AudioContext not available');

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load audio file: ${url}`, error);
      throw error;
    }
  }

  async startSound(soundId: string) {
    const context = await this.ensureAudioContext();
    if (!context) return;

    // Stop existing sound if playing
    this.stopSound(soundId);

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.3);
    gainNode.connect(context.destination);

    const sources: AudioBufferSourceNode[] = [];
    const filters: BiquadFilterNode[] = [];
    const audioFile = getSoundAudioUrl(soundId);

    if (audioFile !== 'generated') {
      // 使用真实音频文件
      try {
        const audioBuffer = await this.loadAudioFile(audioFile);
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(gainNode);
        source.start();
        sources.push(source);
      } catch (error) {
        console.error(`Failed to play audio file for ${soundId}, falling back to generated sound`, error);
        // 如果音频文件加载失败，回退到程序生成的音频
        this.createGeneratedSound(context, sources, filters, gainNode, soundId as any);
      }
    } else {
      // 使用程序生成的音频
      this.createGeneratedSound(context, sources, filters, gainNode, soundId as any);
    }

    // Store references
    this.activeNodes.set(soundId, {
      sources,
      gainNode,
      filters
    });
  }

  private createGeneratedSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode, type: 'rain' | 'ocean' | 'wind' | 'fire' | 'forest' | 'coffee' | 'thunder' | 'birds') {
    // Create realistic sounds based on type
    switch (type) {
      case 'rain':
        this.createRainSound(context, sources, filters, gainNode);
        break;

      case 'ocean':
        this.createOceanSound(context, sources, filters, gainNode);
        break;

      case 'wind':
        this.createWindSound(context, sources, filters, gainNode);
        break;

      case 'fire':
        this.createFireSound(context, sources, filters, gainNode);
        break;

      case 'forest':
        this.createForestSound(context, sources, filters, gainNode);
        break;

      case 'coffee':
        this.createCoffeeShopSound(context, sources, filters, gainNode);
        break;

      case 'thunder':
        this.createThunderSound(context, sources, filters, gainNode);
        break;

      case 'birds':
        this.createBirdSound(context, sources, filters, gainNode);
        break;
    }
  }

  stopSound(soundId: string, fadeDuration: number = 0.3) {
    const nodes = this.activeNodes.get(soundId);
    if (!nodes) return;

    const context = this.audioContext;
    if (context) {
      const now = context.currentTime;
      try {
        nodes.gainNode.gain.cancelScheduledValues(now);
        nodes.gainNode.gain.setValueAtTime(nodes.gainNode.gain.value, now);
        nodes.gainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      } catch (e) {
        console.warn('Failed to fade out sound smoothly', e);
      }

      // Store local copies of nodes to stop in timeout closure
      const sourcesToStop = [...nodes.sources];
      const gainNodeToDisconnect = nodes.gainNode;
      const filtersToDisconnect = [...nodes.filters];

      setTimeout(() => {
        sourcesToStop.forEach(source => {
          try {
            source.stop();
          } catch {
            // Source might already be stopped
          }
        });
        try {
          gainNodeToDisconnect.disconnect();
          filtersToDisconnect.forEach(filter => filter.disconnect());
        } catch {}
      }, fadeDuration * 1000);
    } else {
      nodes.sources.forEach(source => {
        try {
          source.stop();
        } catch {}
      });
      nodes.gainNode.disconnect();
      nodes.filters.forEach(filter => filter.disconnect());
    }

    this.activeNodes.delete(soundId);
  }

  setVolume(soundId: string, volume: number, fadeDuration: number = 0.15) {
    const nodes = this.activeNodes.get(soundId);
    if (nodes && this.audioContext) {
      const context = this.audioContext;
      const now = context.currentTime;
      try {
        nodes.gainNode.gain.cancelScheduledValues(now);
        nodes.gainNode.gain.setValueAtTime(nodes.gainNode.gain.value, now);
        nodes.gainNode.gain.linearRampToValueAtTime(volume, now + fadeDuration);
      } catch {
        // Fallback if ramping fails
        nodes.gainNode.gain.setValueAtTime(volume, now);
      }
    }
  }

  /**
   * 实时合成清脆空灵的电子木鱼声 (KO 与 KISS 原则)
   */
  playWoodenFishSound() {
    this.ensureAudioContext().then(context => {
      if (!context) return;

      const now = context.currentTime;

      // 主增益节点与音量衰减包络 (Gain Node & Volume Decay Envelope)
      const gainNode = context.createGain();
      gainNode.gain.setValueAtTime(0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      gainNode.connect(context.destination);

      // 木鱼本体共鸣腔模拟 (Triangle Wave for Wood Resonance Body)
      const bodyOsc = context.createOscillator();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(240, now); // 空灵低频木头共鸣
      // 敲击时音调极细微下落，增加真实度
      bodyOsc.frequency.exponentialRampToValueAtTime(190, now + 0.15);

      // 槌头敲击瞬态模拟 (Sine Wave for Sharp Mallet Impact Transient)
      const strikeOsc = context.createOscillator();
      strikeOsc.type = 'sine';
      strikeOsc.frequency.setValueAtTime(900, now); // 高频瞬态打击音

      const strikeGain = context.createGain();
      strikeGain.gain.setValueAtTime(0.2, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04); // 极其短促的撞击

      // 连接节点
      bodyOsc.connect(gainNode);
      strikeOsc.connect(strikeGain);
      strikeGain.connect(context.destination);

      // 启动并定时停止
      bodyOsc.start(now);
      strikeOsc.start(now);

      bodyOsc.stop(now + 0.45);
      strikeOsc.stop(now + 0.05);
    });
  }

  /**
   * 模拟禅意古磬敲击声，用于番茄钟等状态提醒 (Aesthetics & Zen)
   */
  playBowlSound() {
    this.ensureAudioContext().then(context => {
      if (!context) return;

      const now = context.currentTime;
      const duration = 3.0; // 古磬余音缭绕，持续3秒

      const gainNode = context.createGain();
      gainNode.gain.setValueAtTime(0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      gainNode.connect(context.destination);

      // 古磬的声音是基频+丰富的泛音组合成的
      const freqs = [150, 300, 452, 604, 755]; // 磬/钟的谐波泛音
      const gains = [0.15, 0.08, 0.05, 0.03, 0.02];

      freqs.forEach((freq, idx) => {
        const osc = context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const oscGain = context.createGain();
        // 泛音随时间衰减更快，基频衰减较慢
        oscGain.gain.setValueAtTime(gains[idx], now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * (1 - idx * 0.15));

        osc.connect(oscGain);
        oscGain.connect(gainNode);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    });
  }

  private createNoiseBuffer(context: AudioContext, type: 'white' | 'pink' | 'brown' = 'white'): AudioBuffer {
    const bufferSize = 2 * context.sampleRate;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      // Gentle white noise
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5; // Reduce amplitude
      }
    } else if (type === 'pink') {
      // Gentle pink noise - 1/f noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = (Math.random() * 2 - 1) * 0.7; // Reduce input amplitude
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.08; // Reduce output amplitude
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      // Gentle brown noise - 1/f² noise
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = (Math.random() * 2 - 1) * 0.6; // Reduce input amplitude
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 2.0; // Reduce output amplitude
      }
    }

    return buffer;
  }

  private createRainSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create gentle rain sound with pink noise
    const noiseBuffer = this.createNoiseBuffer(context, 'pink');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Gentle low-pass filter for soft rain
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, context.currentTime);
    filter.Q.setValueAtTime(0.3, context.currentTime);

    // Add a second filter for extra smoothness
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(6000, context.currentTime);
    filter2.Q.setValueAtTime(0.2, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  private createOceanSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create gentle ocean waves with brown noise
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Very gentle low-pass filter for soft ocean sound
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, context.currentTime);
    filter.Q.setValueAtTime(0.3, context.currentTime);

    // Add very gentle wave oscillation
    const waveOsc = context.createOscillator();
    waveOsc.type = 'sine';
    waveOsc.frequency.setValueAtTime(0.05, context.currentTime); // Much slower waves

    const waveGain = context.createGain();
    waveGain.gain.setValueAtTime(0.1, context.currentTime); // Much quieter

    waveOsc.connect(waveGain);
    waveGain.connect(gainNode);
    waveOsc.start();

    source.connect(filter);
    filter.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter);
  }

  private createWindSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create very gentle wind with brown noise
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Gentle low-pass filter for soft wind
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, context.currentTime);
    filter.Q.setValueAtTime(0.2, context.currentTime);

    // Add a second filter for extra smoothness
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(3000, context.currentTime);
    filter2.Q.setValueAtTime(0.1, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  private createFireSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create gentle crackling fire sound
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Very gentle low-pass filter for warm fire sound
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, context.currentTime);
    filter.Q.setValueAtTime(0.2, context.currentTime);

    // Add warmth with another filter
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(2500, context.currentTime);
    filter2.Q.setValueAtTime(0.1, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  private createForestSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create ambient forest sound with multiple layers
    const noiseBuffer = this.createNoiseBuffer(context, 'pink');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Band-pass filter for forest ambience
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, context.currentTime);
    filter.Q.setValueAtTime(0.5, context.currentTime);

    source.connect(filter);
    filter.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter);
  }

  private createCoffeeShopSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create coffee shop ambience with brown noise
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Low-pass filter for muffled conversation
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, context.currentTime);
    filter.Q.setValueAtTime(0.7, context.currentTime);

    source.connect(filter);
    filter.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter);
  }

  private createThunderSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create very gentle distant thunder
    const noiseBuffer = this.createNoiseBuffer(context, 'brown');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Gentle low-frequency filter for soft rumble
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, context.currentTime); // Higher frequency for less intensity
    filter.Q.setValueAtTime(0.3, context.currentTime); // Lower Q for gentleness

    // Add another filter to make it even softer
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(600, context.currentTime);
    filter2.Q.setValueAtTime(0.2, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  private createBirdSound(context: AudioContext, sources: AudioBufferSourceNode[], filters: BiquadFilterNode[], gainNode: GainNode) {
    // Create very gentle bird ambience
    const noiseBuffer = this.createNoiseBuffer(context, 'pink');
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Gentle band-pass filter for soft bird sounds
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, context.currentTime); // Lower frequency
    filter.Q.setValueAtTime(0.2, context.currentTime); // Very gentle

    // Add a low-pass to remove harsh frequencies
    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(4000, context.currentTime);
    filter2.Q.setValueAtTime(0.1, context.currentTime);

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    source.start();

    sources.push(source);
    filters.push(filter, filter2);
  }

  stopAll() {
    this.activeNodes.forEach((_, soundId) => {
      this.stopSound(soundId);
    });
  }
}

// Singleton instance
let audioGenerator: AudioGenerator | null = null;

export const getAudioGenerator = () => {
  if (!audioGenerator) {
    audioGenerator = new AudioGenerator();
  }
  return audioGenerator;
};
