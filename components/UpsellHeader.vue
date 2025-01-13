<template>
	<section id="topbar" :class="classes">
		<div class="container mx-auto">
			<h2 class="font-medium font-semibold text-sm sm:text-base text-white text-center">{{ text }}</h2>
		</div>
	</section>
</template>
<script lang="ts" setup>
const props = defineProps({
	text: {
		type: String,
		default: ""
	},
	classes:{
		type: String,
		default: ""
	}
});
const { text,classes} = (props);
</script>