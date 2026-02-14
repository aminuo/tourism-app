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
			<uni-tag v-for="(tag, tagIndex) in item.tags" :key="tag.id" :inverted="true" :text="tag.name" :type="getTagType(tagIndex)" />
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

const getTagType = (index) => {
	const types = ['primary', 'success', 'warning', 'error']
	return types[index % types.length]
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
