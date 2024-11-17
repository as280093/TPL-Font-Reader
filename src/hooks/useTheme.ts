import { useEffect } from 'react';

export const useTheme = () => {
  useEffect(() => {
    const appElement = document.querySelector('.app');
    if (appElement) {
      appElement.setAttribute('data-theme', 'dark');
    }
    document.body.setAttribute('data-theme', 'dark');
  }, []);

  return { theme: 'dark' };
};
