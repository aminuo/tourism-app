<template>
	<view class="banners">
		<view v-if="bannerList.length" class="custom-swiper">
			<swiper 
				:autoplay="true" 
				interval="3000" 
				duration="500"
				circular
				class="swiper-box"
			>
				<swiper-item 
					v-for="(item, index) in bannerList" 
					:key="index"
					class="swiper-item"
				>
					<view 
						class="image-wrapper"
						:style="{ backgroundImage: `url(${item.image})` }"
                        @error="handleImageError(index)"
					>
						<view class="banner-title">{{ item.title }}</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="notice">
			<up-notice-bar text="欢迎使用旅游App,点击搜索栏搜索更多景点信息~"/>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBanner } from '@/api/home/index'

const bannerList = ref([])

const handleImageError = (index) => {
	console.warn(`Banner image ${index} failed to load`)
	bannerList.value[index].image = 'static/errorPicture.png'
}

onMounted(() => {
	getBanner().then(res => {
		bannerList.value = res.map(item => ({
			...item,
			image: encodeURI(item.image.replace(/`/g, ''))
		}))
	})
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>