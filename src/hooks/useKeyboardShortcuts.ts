import { useEffect } from 'react';
import { getKeyboardShortcutSounds } from '@/data/sounds';

interface KeyboardShortcutsProps {
  onStopAll: () => void;
  onToggleSound: (soundId: string) => void;
  onMasterVolumeUp: () => void;
  onMasterVolumeDown: () => void;
}

export const useKeyboardShortcuts = ({
  onStopAll,
  onToggleSound,
  onMasterVolumeUp,
  onMasterVolumeDown
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const shortcutSounds = getKeyboardShortcutSounds();
    const digitShortcuts = shortcutSounds.map((_, index) => `Digit${index + 1}`);

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Prevent default behavior for our shortcuts
      const shortcuts = ['Escape', 'Space', 'ArrowUp', 'ArrowDown', ...digitShortcuts];
      if (shortcuts.includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'Escape':
          onStopAll();
          break;
        case 'Space':
          if (shortcutSounds[0]) {
            onToggleSound(shortcutSounds[0].id);
          }
          break;
        case 'ArrowUp':
          onMasterVolumeUp();
          break;
        case 'ArrowDown':
          onMasterVolumeDown();
          break;
        default: {
          const digitIndex = digitShortcuts.indexOf(event.code);
          const sound = shortcutSounds[digitIndex];
          if (sound) {
            onToggleSound(sound.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onStopAll, onToggleSound, onMasterVolumeUp, onMasterVolumeDown]);
};
