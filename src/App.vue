<template>
	<div id="app">
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive" :key="$route.fullPath"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</div>
</template>

<script>
	export default {
		name: 'App'
	}
</script>

<style>
	html,
	body {
		width: 100%;
		overflow-x: hidden;
		height: 100%;
		font-size: 12px;
		margin: 0;
		padding: 0;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		height: 100%;
		width: 100%;
		overflow-x: hidden;
	}
</style>
