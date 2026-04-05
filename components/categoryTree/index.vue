<template>
  <view class="category-tree">
    <view class="categories-container">
      <!-- 一级分类 -->
      <view v-for="category in categories" :key="category.id" class="category-item">
        <view class="category-header">
          <text class="category-name" @click="handleCategoryClick(category, 1)">{{
            category.name
          }}</text>
          <uni-icons
            v-if="category.children && category.children.length > 0"
            :type="expandedCategories.includes(category.id) ? 'top' : 'bottom'"
            size="16"
            color="#999"
            @click="toggleCategory(category)"
            style="cursor: pointer"
          />
        </view>

        <!-- 二级分类 -->
        <view
          v-if="
            expandedCategories.includes(category.id) &&
            category.children &&
            category.children.length > 0
          "
          class="sub-categories"
        >
          <view
            v-for="subCategory in category.children"
            :key="subCategory.id"
            class="sub-category-item"
          >
            <view class="sub-category-header">
              <text class="sub-category-name" @click="handleCategoryClick(subCategory, 2)">{{
                subCategory.name
              }}</text>
              <uni-icons
                v-if="subCategory.children && subCategory.children.length > 0"
                :type="expandedSubCategories.includes(subCategory.id) ? 'top' : 'bottom'"
                size="14"
                color="#999"
                @click="toggleSubCategory(subCategory)"
                style="cursor: pointer"
              />
            </view>

            <!-- 三级分类 -->
            <view
              v-if="
                expandedSubCategories.includes(subCategory.id) &&
                subCategory.children &&
                subCategory.children.length > 0
              "
              class="sub-sub-categories"
            >
              <view
                v-for="subSubCategory in subCategory.children"
                :key="subSubCategory.id"
                class="sub-sub-category-item"
                @click="handleCategoryClick(subSubCategory, 3)"
              >
                {{ subSubCategory.name }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// 定义属性
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});

// 定义事件
const emit = defineEmits(['categoryClick']);

// 展开的一级分类
const expandedCategories = ref([]);

// 展开的二级分类
const expandedSubCategories = ref([]);

// 切换一级分类展开/收起
const toggleCategory = (category) => {
  const index = expandedCategories.value.indexOf(category.id);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
    // 收起时同时收起所有子分类
    if (category.children && category.children.length > 0) {
      category.children.forEach((subCategory) => {
        const subIndex = expandedSubCategories.value.indexOf(subCategory.id);
        if (subIndex > -1) {
          expandedSubCategories.value.splice(subIndex, 1);
        }
      });
    }
  } else {
    expandedCategories.value.push(category.id);
  }
};

// 切换二级分类展开/收起
const toggleSubCategory = (subCategory) => {
  const index = expandedSubCategories.value.indexOf(subCategory.id);
  if (index > -1) {
    expandedSubCategories.value.splice(index, 1);
  } else {
    expandedSubCategories.value.push(subCategory.id);
  }
};

// 处理分类点击
const handleCategoryClick = (category, level) => {
  // 传递分类信息，包括层级
  emit('categoryClick', { ...category, level });
};
</script>

<style scoped lang="scss">
.category-tree {
  .categories-container {
    background-color: #fff;
    border-radius: 10rpx;
    padding: 20rpx;
  }

  .category-item {
    margin-bottom: 10rpx;

    .category-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      .category-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
    }

    .sub-categories {
      padding-left: 30rpx;
      margin-top: 10rpx;

      .sub-category-item {
        margin-bottom: 10rpx;

        .sub-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10rpx 0;

          .sub-category-name {
            font-size: 26rpx;
            color: #666;
          }
        }

        .sub-sub-categories {
          padding-left: 30rpx;
          margin-top: 10rpx;

          .sub-sub-category-item {
            padding: 10rpx 0;
            font-size: 24rpx;
            color: #999;
            transition: all 0.3s;

            &:active {
              color: #2867ce;
            }
          }
        }
      }
    }
  }
}
</style>
