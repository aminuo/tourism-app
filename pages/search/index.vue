<template>
	<view class="search-page">
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
		
		<!-- 便捷搜索标签 -->
		<view class="search-tags">
			<view class="tags-title">热门搜索</view>
			<view class="tags-container">
				<view 
					v-for="(tag, index) in hotTags" 
					:key="index"
					class="tag-item"
					@click="handleTagSearch(tag)"
				>
					{{ tag }}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import searchApi from '@/api/mockData/searchApi'
	
	// 搜索关键词
	const keyword = ref('')
	
	// 热门搜索标签
	const hotTags = ref([])
	
	// 加载热门标签
	onMounted(() => {
		const result = searchApi.getHotTags()
		if (result.code === 1) {
			hotTags.value = result.data
		}
	})
	
	// 处理搜索
	const handleSearch = () => {
		if (keyword.value) {
			uni.navigateTo({
				url: `/pages/search-result/index?keyword=${encodeURIComponent(keyword.value)}`
			})
		}
	}
	
	// 处理标签搜索
	const handleTagSearch = (tag) => {
		keyword.value = tag
		handleSearch()
	}
</script>

<style lang="scss">
	.search-page {
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
	
	.search-tags {
		
		.tags-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		
		.tags-container {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;
		}
		
		.tag-item {
			padding: 15rpx 30rpx;
			background-color: #f5f5f5;
			border-radius: 30rpx;
			font-size: 28rpx;
			color: #333;
			transition: all 0.3s;
			
			&:active {
				background-color: #e0e0e0;
			}
		}
	}
</style>