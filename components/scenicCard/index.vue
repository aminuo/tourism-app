<template>
  <view @click="handleClick">
    <view class="card-body">
      <!-- 左侧图片 -->
      <view class="card-image-wrapper">
        <image
          :src="formatImageUrl(props.item.img || '')"
          mode="aspectFill"
          class="card-image"
          @error="handleImageError"
        />
        <!-- 热门状态角标 -->
        <HotStatusBadge :status="props.item.hotStatus" />
      </view>

      <!-- 右侧内容区域 -->
      <view class="card-content">
        <!-- 第一层：标题 + 标签 -->
        <view class="content-top">
          <text class="card-title">{{ props.item.title }}</text>
          <view class="card-tags">
            <uni-tag
              v-for="(tag, tagIndex) in props.item.tags"
              :key="tag.id || tagIndex"
              :inverted="true"
              :text="tag.name"
              :type="getTagType(tagIndex)"
              size="mini"
              custom-style="margin-left: 8rpx;"
            />
          </view>
        </view>

        <!-- 第二层：介绍信息 (超出隐藏) -->
        <view class="content-middle">
          <text class="card-intro">{{ props.item.introduce || '暂无详细介绍' }}</text>
        </view>

        <!-- 第三层：时间 -->
        <view class="content-bottom">
          {{ props.item.times }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import HotStatusBadge from '../hotStatusBadge/index.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      img: '',
      title: '',
      tags: [],
      introduce: '',
      times: '',
    }),
  },
});

const handleClick = () => {
  if (props.item.id) {
    uni.navigateTo({
      url: `/pages/detail/index?id=${props.item.id}`,
    });
  }
};

const getTagType = (index) => {
  const types = ['primary', 'success', 'warning', 'error'];
  return types[index % types.length];
};

const formatImageUrl = (url) => {
  if (!url) return '';
  return url.replace(/`/g, '');
};

const handleImageError = (e) => {
  console.error('图片加载失败:', e);
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
