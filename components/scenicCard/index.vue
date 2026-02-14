<template>
	<up-card @click="handleClick" class="scenic-card">
		<template #body>
			<image 
				:src="formatImageUrl(props.item.img || '')" 
				mode="aspectFill" 
				class="card-image"
				@error="handleImageError"
			/>
			<view class="card-content">
				<view class="card-title">{{ item.title }}</view>
				<view class="card-tags">
					<uni-tag 
						v-for="(tag, tagIndex) in item.tags" 
						:key="tag.id" 
						:inverted="true" 
						:text="tag.name" 
						:type="getTagType(tagIndex)" 
					/>
				</view>
				<view class="card-info">
					<text class="card-times">{{ item.times }}</text>
				</view>
			</view>
		</template>
	</up-card>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'

const props = defineProps({
	item: {
		type: Object,
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

const formatImageUrl = (url) => {
	if (!url) return ''
	return url.replace(/`/g, '')
}

// 图片加载失败处理
const handleImageError = (e) => {
	console.error('图片加载失败:', currentImageUrl.value, e)
	currentImageUrl.value = '/static/errorPicture.png'
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>