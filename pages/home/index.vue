<template>
	<view class="content">
		<view class="search" @click="goSearch">
			<up-search placeholder="搜索景点" :showAction="false" bg-color="#e3e3e3" v-model="keyword"></up-search>
		</view>
		<view class="banners">
			<Banners/>
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
		getHomeList
	} from '../../api/home/index.js'
	import {
		onLoad,
		onPageScroll
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'
	import Banners from './banners/index.vue'
	import ScenicSpot from '../../components/scenicSpot/index.vue'

	const keyword = ref('')
	// 瀑布流数据
	const flowList = ref([])
	// 滚动是否显示
	const showTopBtn = ref(0)

	onLoad(() => {
		getHomeList().then(res => {
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
		uni.navigateTo({
			url: `/pages/detail/index?id=${item.id}`
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
		uni.navigateTo({
			url: '/pages/home/search/index'
		})
	}
</script>
<style lang="scss">
@import "./index.scss";
</style>
