'use client';

import { useState, useEffect, useLayoutEffect } from 'react';

export type Theme = 'light' | 'dark';
export type ThemeMode = 'auto' | 'manual';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mode, setMode] = useState<ThemeMode>('auto');
  const [mounted, setMounted] = useState(false);

  // 检查当前时间是否应该使用夜间主题
  const shouldUseDarkTheme = () => {
    const now = new Date();
    const hour = now.getHours();
    // 22:00 - 08:00 使用夜间主题
    return hour >= 22 || hour < 8;
  };

  // 初始化主题和模式
  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    
    if (savedMode) {
      setMode(savedMode);
    }
    
    if (savedMode === 'manual' && savedTheme) {
      setTheme(savedTheme);
    } else {
      // 如果是自动模式或没有保存的主题，根据时间自动设置
      const autoTheme = shouldUseDarkTheme() ? 'dark' : 'light';
      setTheme(autoTheme);
    }
  }, []);

  // 应用主题到 document - 使用 useLayoutEffect 确保在绘制前应用
  useLayoutEffect(() => {
    if (!mounted) return;
    
    applyThemeToDOM(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // 立即应用主题到 DOM 的函数
  const applyThemeToDOM = (newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    
    // 立即应用主题类
    if (newTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    
    // 触发重新渲染所有使用主题的组件
    window.dispatchEvent(new CustomEvent('themeChange', {
      detail: { theme: newTheme }
    }));
    
    // 强制重绘
    void root.offsetHeight;
  };

  // 同步其他组件触发的主题变化，避免每个 useTheme 实例状态不一致
  useEffect(() => {
    if (!mounted) return;

    const handleExternalThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<{ theme?: Theme }>).detail?.theme;
      if (nextTheme === 'light' || nextTheme === 'dark') {
        setTheme(prevTheme => (prevTheme === nextTheme ? prevTheme : nextTheme));
      }
    };

    window.addEventListener('themeChange', handleExternalThemeChange as EventListener);
    return () => window.removeEventListener('themeChange', handleExternalThemeChange as EventListener);
  }, [mounted]);

  // 保存模式到 localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('themeMode', mode);
  }, [mode, mounted]);

  // 手动切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setMode('manual'); // 切换主题时自动切换到手动模式
    
    // 立即应用主题到 DOM，不等待状态更新
    if (mounted) {
      applyThemeToDOM(newTheme);
    }
    
    setTheme(newTheme);
  };

  // 切换自动/手动模式
  const toggleMode = () => {
    if (mode === 'auto') {
      setMode('manual');
    } else {
      setMode('auto');
      // 切换到自动模式时，立即应用基于时间的主题
      const autoTheme = shouldUseDarkTheme() ? 'dark' : 'light';
      
      // 立即应用主题到 DOM
      if (mounted) {
        applyThemeToDOM(autoTheme);
      }
      
      setTheme(autoTheme);
    }
  };

  // 根据时间自动切换主题
  const autoSwitchTheme = () => {
    // 只在自动模式下切换主题
    if (mode === 'auto') {
      const autoTheme = shouldUseDarkTheme() ? 'dark' : 'light';
      setTheme(autoTheme);
    }
  };

  // 在服务器端渲染时返回默认值，避免 hydration 错误
  if (!mounted) {
    return {
      theme: 'light' as Theme,
      setTheme: () => {},
      mode: 'auto' as ThemeMode,
      setMode: () => {},
      toggleTheme: () => {},
      toggleMode: () => {},
      autoSwitchTheme: () => {},
      isDark: false,
      isAutoMode: true
    };
  }

  return {
    theme,
    setTheme,
    mode,
    setMode,
    toggleTheme,
    toggleMode,
    autoSwitchTheme,
    isDark: theme === 'dark',
    isAutoMode: mode === 'auto'
  };
}