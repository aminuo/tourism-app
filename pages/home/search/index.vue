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

    <!-- 搜索历史 -->
    <view class="search-tags" v-if="searchHistory.length > 0">
      <view class="tags-title">搜索历史</view>
      <view class="tags-container">
        <view
          v-for="item in searchHistory"
          :key="item.id"
          class="tag-item"
          @click="handleHistorySearch(item)"
        >
          {{ item.keyword }}
        </view>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="search-tags" v-if="categories.length > 0">
      <view class="tags-title">景点分类</view>
      <category-tree :categories="categories" @category-click="handleCategorySearch" />
    </view>

    <!-- 属性标签 -->
    <view class="search-tags" v-if="allPropertyTags.length > 0">
      <view class="tags-title">属性标签</view>
      <view class="tags-container">
        <view
          v-for="tag in allPropertyTags"
          :key="tag.id"
          class="tag-item"
          @click="handleTagSearch(tag)"
        >
          {{ tag.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getTagCategories, getTagProperties, getSearchHistory } from '@/api/home/index.js';
import CategoryTree from '@/components/categoryTree/index.vue';

// 搜索关键词
const keyword = ref('');

// 分类标签
const categories = ref([]);

// 属性标签
const properties = ref({});

// 合并的属性标签
const allPropertyTags = ref([]);

// 搜索历史
const searchHistory = ref([]);

// 合并属性标签
const mergeProperties = (properties) => {
  const result = [];
  for (const type in properties) {
    if (properties.hasOwnProperty(type)) {
      result.push(...properties[type]);
    }
  }
  return result;
};

// 加载标签数据
onMounted(async () => {
  try {
    // 获取分类标签
    const categoriesResult = await getTagCategories();
    if (categoriesResult && categoriesResult.categories) {
      categories.value = categoriesResult.categories;
    }

    // 获取属性标签
    const propertiesResult = await getTagProperties();
    if (propertiesResult && propertiesResult.properties) {
      properties.value = propertiesResult.properties;
      allPropertyTags.value = mergeProperties(propertiesResult.properties);
    }

    // 获取搜索历史
    const historyResult = await getSearchHistory();
    if (historyResult) {
      searchHistory.value = historyResult;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
});

// 处理搜索
const handleSearch = () => {
  if (keyword.value) {
    uni.navigateTo({
      url: `/pages/home/search-result/index?keyword=${encodeURIComponent(keyword.value)}&type=keyword`,
    });
  }
};

// 处理分类搜索
const handleCategorySearch = (category) => {
  keyword.value = category.name;
  uni.navigateTo({
    url: `/pages/home/search-result/index?keyword=${encodeURIComponent(category.code)}&type=tag&tagName=${encodeURIComponent(category.name)}`,
  });
};

// 处理标签搜索
const handleTagSearch = (tag) => {
  keyword.value = tag.name;
  uni.navigateTo({
    url: `/pages/home/search-result/index?keyword=${encodeURIComponent(tag.code)}&type=tag&tagName=${encodeURIComponent(tag.name)}`,
  });
};

// 处理搜索历史点击
const handleHistorySearch = (item) => {
  keyword.value = item.keyword;
  uni.navigateTo({
    url: `/pages/home/search-result/index?keyword=${encodeURIComponent(item.keyword)}&type=keyword`,
  });
};
</script>

<style lang="scss">
@import './index.scss';
</style>
