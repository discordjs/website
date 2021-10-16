import { ref } from 'vue';

const keyName = 'reduced-motion';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;
const reducedMotionCacheValue = localStorage.getItem(keyName);
const reducedMotionValue = reducedMotionCacheValue === null ? prefersReducedMotion : reducedMotionCacheValue === 'true';
localStorage.setItem(keyName, String(reducedMotionValue));

export const isReducedMotion = ref(reducedMotionValue);

if (reducedMotionValue) {
	document.documentElement.classList.add('reduce-motion');
	document.documentElement.classList.remove('full-motion');
} else {
	document.documentElement.classList.add('full-motion');
	document.documentElement.classList.remove('reduce-motion');
}

export const toggleReducedMotion = (value: boolean): void => {
	localStorage.setItem(keyName, String(value));
	document.documentElement.classList.toggle('full-motion');
	document.documentElement.classList.toggle('reduce-motion');
};
