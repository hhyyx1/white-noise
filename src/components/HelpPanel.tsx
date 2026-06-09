'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Keyboard } from 'lucide-react';
import { getKeyboardShortcutSounds } from '@/data/sounds';
import { useTheme } from '@/hooks/useTheme';

export const HelpPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const shortcutSounds = getKeyboardShortcutSounds();
  const { isDark } = useTheme();

  const shortcuts = [
    { key: 'ESC', description: '停止所有声音' },
    { key: 'SPACE', description: `切换${shortcutSounds[0]?.name ?? '第一个声音'}` },
    { key: '↑', description: '增加主音量' },
    { key: '↓', description: '减少主音量' },
    ...shortcutSounds.map((sound, index) => ({
      key: String(index + 1),
      description: `切换${sound.name}`
    }))
  ];

  return (
    <>
      {/* Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg border transition-all duration-300 z-40 cursor-pointer ${
          isDark
            ? 'bg-slate-800/90 text-slate-200 border-slate-600/50 hover:bg-slate-700/90'
            : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'
        }`}
        title="帮助和快捷键"
      >
        <HelpCircle className="w-5 h-5" />
      </motion.button>

      {/* Help Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-slate-800/95 border-slate-600/50 text-slate-200'
                  : 'bg-white/95 border-gray-200 text-gray-800'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Keyboard className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>键盘快捷键</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg cursor-pointer ${
                    isDark ? 'bg-slate-700 hover:bg-slate-650 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Shortcuts List */}
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? 'bg-slate-700/40 border border-slate-600/30' : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>{shortcut.description}</span>
                    <kbd className={`px-2 py-1 text-sm rounded font-mono border ${
                      isDark ? 'bg-slate-700 text-slate-100 border-slate-600' : 'bg-gray-200 text-gray-800 border-gray-300'
                    }`}>
                      {shortcut.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              {/* Tips */}
              <div className={`mt-6 p-4 rounded-lg border ${
                isDark ? 'bg-blue-950/40 border-blue-900/50 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <h3 className="font-semibold mb-2">使用提示</h3>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  <li>• 可以同时播放多个声音来创造独特的氛围</li>
                  <li>• 使用音量滑块调节每个声音的强度</li>
                  <li>• 尝试不同的预设组合找到最适合的声音</li>
                  <li>• 在专注工作或放松时使用白噪音效果最佳</li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg cursor-pointer"
              >
                知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
