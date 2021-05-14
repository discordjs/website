<template>
	<div class="relative h-10 w-10 my-60 mx-auto">
		<div class="cube1 bg-discord-blurple-560 h-4 w-4 absolute"></div>
		<div class="cube2 bg-discord-blurple-560 h-4 w-4 absolute"></div>
	</div>
</template>

<style>
.cube1,
.cube2 {
	animation: cubemove 1.8s infinite ease-in-out;
}

.cube2 {
	animation-delay: -0.9s;
}

@keyframes cubemove {
	25% {
		transform: translateX(42px) rotate(-90deg) scale(0.5);
	}
	50% {
		transform: translateX(42px) translateY(42px) rotate(-179deg);
	}
	50.1% {
		transform: translateX(42px) translateY(42px) rotate(-180deg);
	}
	75% {
		transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
	}
	100% {
		transform: rotate(-360deg);
	}
}
</style>
