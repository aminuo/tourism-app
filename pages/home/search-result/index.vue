<template>
  <view class="search-result-page">
    <!-- 搜索栏 -->
    <view class="search-header">
      <up-search
        placeholder="搜索景点"
        bg-color="#e3e3e3"
        v-model="displayKeyword"
        @search="handleSearch"
        @confirm="handleSearch"
      ></up-search>
    </view>

    <!-- 搜索结果 -->
    <view class="search-result">
      <view class="result-title">
        搜索结果："{{ searchType === 'tag' ? tagName : keyword }}" 共 {{ total }} 条
      </view>

      <view class="result-list">
        <scenic-card
          v-for="(item, index) in searchResult"
          :key="item.id"
          :index="index"
          :item="item"
          @click="goDetail"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getHomeList } from '@/api/home/index';
import ScenicCard from '@/components/scenicCard/index.vue';

// 搜索关键词
const keyword = ref('');
// 搜索类型：keyword 或 tag
const searchType = ref('keyword');
// 分类ID
const categoryId = ref('');
// 分类层级
const level = ref(1);
// 标签名称
const tagName = ref('');
// 显示在搜索框中的关键词
const displayKeyword = computed({
  get: () => {
    return searchType.value === 'tag' ? tagName.value : keyword.value;
  },
  set: (value) => {
    keyword.value = value;
  },
});
// 搜索结果
const searchResult = ref([]);
// 总结果数
const total = ref(0);
// 加载状态
const loading = ref(false);

// 页面加载时获取搜索关键词和类型并执行搜索
onLoad((option) => {
  if (option.keyword) {
    keyword.value = decodeURIComponent(option.keyword);
    searchType.value = option.type || 'keyword';
    categoryId.value = option.categoryId || '';
    level.value = option.level || 1;
    tagName.value = option.tagName ? decodeURIComponent(option.tagName) : '';
    // 执行搜索
    executeSearch();
  }
});

// 处理搜索
const handleSearch = () => {
  if (keyword.value) {
    // 执行搜索，默认为关键词搜索
    searchType.value = 'keyword';
    executeSearch();
  }
};

// 执行搜索
const executeSearch = async () => {
  loading.value = true;
  try {
    // 根据搜索类型调用接口
    let params = {};
    if (searchType.value === 'keyword') {
      params = { title: keyword.value };
    } else if (searchType.value === 'tag') {
      // 统一使用 tagCode 参数
      params = { tagCode: keyword.value };
    }

    console.log('搜索参数:', params);
    const result = await getHomeList(params);
    searchResult.value = result || [];
    total.value = searchResult.value.length;
  } catch (error) {
    console.error('搜索失败:', error);
    uni.showToast({
      title: '搜索失败，请稍后重试',
      icon: 'none',
    });
  } finally {
    loading.value = false;
  }
};

// 跳转到详情页
const goDetail = (item) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${item.id}`,
  });
};
</script>

<style lang="scss">
@import './index.scss';
</style>
