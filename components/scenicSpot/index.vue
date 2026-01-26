<template>
	<view class="demo-waterfall-item" @click="handleClick">
		<up-lazy-load threshold="-450" border-radius="10" :image="item.img" :index="index"></up-lazy-load>
		<view class="demo-title">
			{{ item.title }}
		</view>
		<view class="demo-price">
			{{ item.times }}
		</view>
		<view class="demo-tag">
			<view class="demo-tag-owner">
				{{ item.tag[0] }}
			</view>
			<view class="demo-tag-text">
				{{ item.tag[1] }}
			</view>
		</view>
		<view class="isDot" v-if="item.isDot">
			{{ item.isDot }}
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		item: {
			type: Object,
			required: true
		},
		index: {
			type: Number,
			required: true
		}
	})

	const emit = defineEmits(['click'])

	const handleClick = () => {
		emit('click', props.item)
	}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
