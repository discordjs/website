import { useMediaQuery, useStorage } from '@vueuse/core';

const keyName = 'reduced-motion';
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion)');
const state = useStorage(keyName, prefersReducedMotion.value);

export const usePreferredReducedMotion = prefersReducedMotion.value ? prefersReducedMotion : state;

if (usePreferredReducedMotion.value) {
	document.documentElement.classList.add('reduce-motion');
	document.documentElement.classList.remove('full-motion');
} else {
	document.documentElement.classList.add('full-motion');
	document.documentElement.classList.remove('reduce-motion');
}

export const toggleReducedMotion = (value: boolean): void => {
	state.value = value;
	document.documentElement.classList.toggle('full-motion');
	document.documentElement.classList.toggle('reduce-motion');
};
