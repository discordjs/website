import { ref } from 'vue';

const keyName = 'reduced-motion';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;
const reducedMotionCacheValue = localStorage.getItem(keyName);
const reducedMotionValue =
	reducedMotionCacheValue === null ? prefersReducedMotion : reducedMotionCacheValue === 'true' ? true : false;
localStorage.setItem(keyName, String(reducedMotionValue));

export const isReducedMotion = ref(reducedMotionValue);

export const toggleReducedMotion = (value: boolean): void => {
	localStorage.setItem(keyName, String(value));
};
