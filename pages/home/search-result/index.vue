<template>
	<view class="search-result-page">
		<!-- 搜索栏 -->
		<view class="search-header">
			<up-search 
				placeholder="搜索景点" 
				bg-color="#e3e3e3" 
				v-model="keyword"
				@search="handleSearch"
				@confirm="handleSearch"
			></up-search>
			<view class="search-btn" @click="handleSearch">
				搜索
			</view>
		</view>
		
		<!-- 搜索结果 -->
		<view class="search-result">
			<view class="result-title">
				搜索结果："{{ keyword }}" 共 {{ total }} 条
			</view>
			
			<view class="result-list">
				<ScenicSpot v-for="(item, index) in searchResult" :key="item.id" :item="item" :index="index" @click="goDetail"></ScenicSpot>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
	import searchApi from '@/api/mockData/searchApi'
	import ScenicSpot from '@/components/scenicSpot/index.vue'
	
	// 搜索关键词
	const keyword = ref('')
	// 搜索结果
	const searchResult = ref([])
	// 总结果数
	const total = ref(0)
	
	// 页面加载时获取搜索关键词并执行搜索
	onLoad((option) => {
		if (option.keyword) {
			keyword.value = decodeURIComponent(option.keyword)
			// 执行搜索
			executeSearch()
		}
	})
	
	// 处理搜索
	const handleSearch = () => {
		if (keyword.value) {
			// 执行搜索
			executeSearch()
		}
	}
	
	// 执行搜索
	const executeSearch = () => {
		const result = searchApi.getSearchResult(keyword.value)
		if (result.code === 1) {
			searchResult.value = result.data
			total.value = result.total
		}
	}
	
	// 跳转到详情页
	const goDetail = (item) => {
		const can = JSON.stringify(item)
		uni.navigateTo({
			url: `/pages/detail/index?item=${encodeURIComponent(can)}`
		})
	}
</script>

<style lang="scss">
	.search-result-page {
		padding: 15rpx;
	}
	
	.search-header {
		display: flex;
		align-items: center;
		gap: 15rpx;
		margin-bottom: 30rpx;
	}
	
	.search-btn {
		padding: 0 20rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #2867CE;
		color: white;
		border-radius: 35rpx;
		font-size: 28rpx;
	}
	
	.search-result {
		.result-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		
		.result-list {
			// 使用 ScenicSpot 组件的样式
		}
	}
</style>