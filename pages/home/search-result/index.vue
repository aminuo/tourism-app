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
				<up-card v-for="(item, index) in searchResult" :key="item.id" @click="goDetail(item)" class="result-card">
					<template #cover>
						<image :src="item.img" mode="aspectFill" class="card-image"></image>
					</template>
					<template #body>
						<view class="card-title">{{ item.title }}</view>
						<view class="card-tags">
							<view v-for="(tag, tagIndex) in item.tag" :key="tagIndex" class="card-tag">
								{{ tag }}
							</view>
						</view>
						<view class="card-info">
							<text class="card-address">{{ item.address }}</text>
							<text class="card-rating">评分：{{ item.rating }}</text>
						</view>
					</template>
				</up-card>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'
	import { getHomeList } from '@/api/home/index'
	
	// 搜索关键词
	const keyword = ref('')
	// 搜索类型：keyword 或 tag
	const searchType = ref('keyword')
	// 搜索结果
	const searchResult = ref([])
	// 总结果数
	const total = ref(0)
	// 加载状态
	const loading = ref(false)
	
	// 页面加载时获取搜索关键词和类型并执行搜索
	onLoad((option) => {
		if (option.keyword) {
			keyword.value = decodeURIComponent(option.keyword)
			searchType.value = option.type || 'keyword'
			// 执行搜索
			executeSearch()
		}
	})
	
	// 处理搜索
	const handleSearch = () => {
		if (keyword.value) {
			// 执行搜索，默认为关键词搜索
			searchType.value = 'keyword'
			executeSearch()
		}
	}
	
	// 执行搜索
	const executeSearch = async () => {
		loading.value = true
		try {
			// 根据搜索类型调用接口
			const params = searchType.value === 'tag' 
				? { tag: keyword.value } 
				: { title: keyword.value }
			
			const result = await getHomeList(params)
			searchResult.value = result || []
			total.value = result.length
		} catch (error) {
			console.error('搜索失败:', error)
			uni.showToast({
				title: '搜索失败，请稍后重试',
				icon: 'none'
			})
		} finally {
			loading.value = false
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
			display: flex;
			flex-direction: column;
			gap: 20rpx;
		}
		
		.result-card {
			border-radius: 12rpx;
			overflow: hidden;
		}
		
		.card-image {
			width: 100%;
			height: 300rpx;
		}
		
		.card-title {
			font-size: 30rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		
		.card-tags {
			display: flex;
			gap: 10rpx;
			margin-bottom: 15rpx;
		}
		
		.card-tag {
			padding: 4rpx 12rpx;
			background-color: #f0f0f0;
			border-radius: 15rpx;
			font-size: 24rpx;
		}
		
		.card-info {
			display: flex;
			justify-content: space-between;
			font-size: 26rpx;
			color: #666;
		}
		
		.card-address {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-right: 20rpx;
		}
		
		.card-rating {
			color: #ff6b6b;
		}
	}
</style>