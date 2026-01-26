<template>
	<view class="content">
		<view class="search" @click="goSearch">
			<up-search placeholder="搜索景点" :showAction="false" bg-color="#e3e3e3" v-model="keyword"></up-search>
		</view>
		<view class="carousel">
			<up-swiper v-if="bannerList.length" :list="bannerList" keyName="image" showTitle radius="8" :autoplay="true"
			height="160"></up-swiper>
			<view class="notice">
				<up-notice-bar text="欢迎使用旅游App,点击搜索栏搜索更多景点信息~"></up-notice-bar>
			</view>		    
		</view>
		<view class="list">
			<up-waterfall v-model="flowList" ref="uWaterfallRef">
				<template v-slot:left="{ leftList }">
					<ScenicSpot v-for="(item,index) in leftList" :key="index" :item="item" :index="index" @click="goDetail"></ScenicSpot>
				</template>
				<template v-slot:right="{ rightList }">
					<ScenicSpot v-for="(item,index) in rightList" :key="index" :item="item" :index="index" @click="goDetail"></ScenicSpot>
				</template>
			</up-waterfall>
		</view>
		<view v-if="showTopBtn" @click="Totop" class="topClass">
			<up-icon name="arrow-upward" color="#fff" size="28"></up-icon>
		</view>
	</view>
</template>

<script setup>
	import {
		getBanner,
		getHomeList
	} from '../../api/home/index.js'
	import {
		onLoad,
		onReachBottom,
		onPageScroll
	} from '@dcloudio/uni-app'
	import {
		ref,
		reactive
	} from 'vue'
	import ScenicSpot from '../../components/scenicSpot/index.vue'

	const keyword = ref('')
	// 轮播数据
	const bannerList = ref([])
	// 瀑布流数据
	const flowList = ref([])
	// 滚动是否显示
	const showTopBtn = ref(0)

	onLoad(() => {
		getBanner().then(res => {
			console.log(res, 'res')
			bannerList.value = res.map(item => ({
				...item,
				image: item.image.replace(/`/g, '')
			}))
		})
		getHomeList().then(res => {
			console.log(res, 'getHomeList')
			flowList.value = res
		})
	})
	// onReachBottom(() => {
	// 	console.log('触底')
	// 	// 模拟触底后数据的加载
	// 	setTimeout(() => {
	// 		addRandomData()
	// 	}, 1000)
	// })
	onPageScroll((e) => {
		if (e.scrollTop > 600) {
			showTopBtn.value = 1
		} else {
			showTopBtn.value = 0
		}
	})

	const goDetail = (item) => {
		const can = JSON.stringify(item)
		uni.navigateTo({
			url: `/pages/detail/index?item=${encodeURIComponent(can)}`
		})
	}

	const Totop = () => {
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300
		})
	}
	
	// 跳转到搜索界面
	const goSearch = () => {
		console.log(keyword.value, 'keyword.value')
		uni.navigateTo({
			url: '/pages/home/search/index'
		})
	}
</script>
<style lang="scss">
@import "./index.scss";
</style>
