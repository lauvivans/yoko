import { ThemeEnum } from '@/enum/ThemeEnum';

const LS_KEY = 'yoko-theme';

export function getStoredTheme() {
  const theme = localStorage.getItem(LS_KEY);
  return theme ?? ThemeEnum.Light;
}

export function storeTheme(theme: string) {
  localStorage.setItem(LS_KEY, theme);
}
