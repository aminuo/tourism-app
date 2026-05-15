<template>
  <view class="like">
    <!-- 未登录状态 -->
    <view v-if="!isLoggedIn()" class="login-prompt">
      <view class="login-prompt-content">
        <text class="login-prompt-text">登录后查看收藏内容</text>
        <view class="login-btn" @click="goToLogin">去登录</view>
      </view>
    </view>
    <!-- 已登录且有收藏 -->
    <view v-else-if="linkList.length > 0" class="like-list">
      <scenic-card v-for="(item, index) in linkList" :key="item.id || index" :item="item" />
    </view>
    <!-- 已登录但无收藏 -->
    <view v-else class="empty-prompt">
      <text class="empty-text">暂无收藏内容</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getFavorites } from '../../api/like/index.js';
import ScenicCard from '../../components/scenicCard/index.vue';

const linkList = ref([]);

const isLoggedIn = () => {
  return !!uni.getStorageSync('token')
}

const fetchFavorites = () => {
  if (!isLoggedIn()) {
    linkList.value = []
    return
  }
  getFavorites().then((res) => {
    console.log(res);
    linkList.value = res.favorites || [];
  });
};

const goToLogin = () => {
  uni.switchTab({
    url: '/pages/my/index'
  });
}

onLoad(() => {
  fetchFavorites();
});

onShow(() => {
  fetchFavorites();
});
</script>
<style lang="scss">
@import './index.scss';
</style>
