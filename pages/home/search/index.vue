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
				url: `/pages/home/search-result/index?keyword=${encodeURIComponent(keyword.value)}`
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
	@import './index.scss';
</style>