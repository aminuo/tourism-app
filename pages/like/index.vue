<template>
  <view class="like">
    <view class="like-list">
      <scenic-card v-for="(item, index) in linkList" :key="item.id || index" :item="item" />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getFavorites } from '../../api/like/index.js';
import ScenicCard from '../../components/scenicCard/index.vue';

const linkList = ref([]);

const fetchFavorites = () => {
  getFavorites().then((res) => {
    console.log(res);
    linkList.value = res.favorites || [];
  });
};

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
