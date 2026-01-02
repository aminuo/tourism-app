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
				<view 
					v-for="(item, index) in searchResult" 
					:key="item.id"
					class="result-item"
					@click="goDetail(item)"
				>
					<up-image 
				:src="item.img" 
				mode="aspectFill"
				class="item-image"
				width="200"
				height="140"
				radius="10rpx"
			></up-image>
					<view class="item-info">
						<view class="item-title">{{ item.title }}</view>
						<view class="item-address">{{ item.address }}</view>
						<view class="item-introduce">{{ item.introduce.substring(0, 60) }}...</view>
						<view class="item-tag">
							<view v-for="(tag, tagIndex) in item.tag" :key="tagIndex" class="item-tag-text">
								{{ tag }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
	import searchApi from '@/api/mockData/searchApi'
	
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
			.result-item {
				display: flex;
				gap: 20rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				border-radius: 10rpx;
				box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
				
				.item-image {
					width: 200rpx;
					height: 140rpx;
					border-radius: 10rpx;
					overflow: hidden;
					position: relative;
					
					// 控制内部图片元素
					& .u-image__image {
						width: 100% !important;
						height: 100% !important;
						object-fit: cover;
					}
				}
				
				.item-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 10rpx;
					
					.item-title {
						font-size: 30rpx;
						font-weight: bold;
					}
					
					.item-address {
						font-size: 24rpx;
						color: #666;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					
					.item-introduce {
						font-size: 24rpx;
						color: #999;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					
					.item-tag {
						display: flex;
						gap: 10rpx;
						flex-wrap: wrap;
						
						.item-tag-text {
							padding: 0 10rpx;
							height: 36rpx;
							line-height: 36rpx;
							background-color: #e0e0e0;
							color: #333;
							font-size: 20rpx;
							border-radius: 5rpx;
						}
					}
				}
				
				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>