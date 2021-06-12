import { useDark, useToggle } from '@vueuse/core';

export const isDarkMode = useDark({ storageKey: 'theme' });
export const toggleDarkMode = useToggle(isDarkMode);
