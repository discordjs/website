import { useMediaQuery, useStorage } from '@vueuse/core';
import { watchEffect } from 'vue';

const keyName = 'reduced-motion';
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion)');
const state = useStorage(keyName, prefersReducedMotion.value);

export const usePreferredReducedMotion = state;

if (usePreferredReducedMotion.value) {
	document.documentElement.classList.add('reduce-motion');
} else {
	document.documentElement.classList.remove('reduce-motion');
}

let firstLoad = true;

export const toggleReducedMotion = (value: boolean): void => {
	if (firstLoad) {
		firstLoad = false;
		return;
	}

	state.value = value;
	document.documentElement.classList.toggle('reduce-motion');
};

watchEffect(() => toggleReducedMotion(prefersReducedMotion.value));
