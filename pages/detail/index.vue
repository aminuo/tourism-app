<template>
  <view class="detail">
    <view class="d-con">
      <image :src="formatImageUrl(details.dt.img)" mode="aspectFill"></image>
      <view class="d-content">
        <view class="j-con">
          <view class="tit" style="display: flex; align-items: center; flex-wrap: wrap">
            <text style="margin-right: 7px; font-size: 17px">{{ details.dt.title }}</text>
            <view style="display: flex; gap: 8rpx">
              <up-tag
                v-for="(tag, index) in details.dt.tags"
                :key="tag.id"
                :text="tag.name"
                size="mini"
                shape="circle"
              />
            </view>
          </view>
          <view class="jj">
            <view style="font-weight: 700; font-size: 14px">景区介绍</view>
            <view class="nr">{{ details.dt.introduce }}</view>
          </view>
          <view class="j-con">
            <view class="jj">
              <text style="font-weight: 700; font-size: 14px">开放时间：</text>
              <text class="nr">{{ details.dt.times }}</text>
            </view>
          </view>
          <view class="j-con">
            <view class="jj" style="display: flex; align-items: center">
              <uni-icons
                :type="isFavorite ? 'heart-filled' : 'heart'"
                :color="isFavorite ? '#ff4d4f' : '#999'"
                size="30"
                @click="handleFavorite"
                style="cursor: pointer"
              />
            </view>
          </view>
          <view class="j-con ls">
            <view class="tit" style="font-size: 34rpx">游玩推荐</view>
            <view class="jj tj-list">
              <view
                class="item"
                v-for="(item, index) in projectList"
                :key="index"
                @click="goLine(item)"
              >
                <image :src="item.url" mode="aspectFill"></image>
                <view class="topFixed">
                  {{ item.tag }}
                </view>
                <view class="infos">
                  <view class="tit">{{ item.title }}</view>
                  <view class="desc">
                    <up-icon name="map" color="#9c9c9c" size="16"></up-icon>
                    <text class="text">{{ item.desc }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref, reactive } from 'vue';
import { detailProject } from '../../api/api.js';
import { getDetail } from '../../api/home/index.js';
import { addFavorite, removeFavorite, getFavorites } from '../../api/like/index.js';

const details = reactive({
  dt: {},
});

const projectList = ref([]);
const isFavorite = ref(false);

const goLine = (item) => {
  uni.navigateTo({
    url: `/pages/line/index?id=${item.id}`,
  });
};

const handleFavorite = async () => {
  try {
    if (isFavorite.value) {
      // 取消收藏
      await removeFavorite(details.dt.id);
      uni.showToast({ title: '取消收藏成功', icon: 'success' });
      isFavorite.value = false;
    } else {
      // 添加收藏
      await addFavorite(details.dt.id);
      uni.showToast({ title: '收藏成功', icon: 'success' });
      isFavorite.value = true;
    }
  } catch (error) {
    console.error('操作失败:', error);
    uni.showToast({ title: error || '操作失败', icon: 'none' });
  }
};

const checkFavoriteStatus = async () => {
  try {
    const favorites = await getFavorites();
    if (favorites && favorites.favorites) {
      const isFav = favorites.favorites.some((item) => item.id === details.dt.id);
      isFavorite.value = isFav;
    }
  } catch (error) {
    console.error('获取收藏状态失败:', error);
  }
};

// 处理图片路径，移除反引号
const formatImageUrl = (url) => {
  if (!url) return '';
  return url.replace(/`/g, '');
};

onLoad(async (opt) => {
  try {
    // 从路由参数中获取景点id
    const id = opt.id;
    if (!id) {
      uni.showToast({
        title: '缺少景点ID',
        icon: 'error',
      });
      return;
    }

    // 调用getDetail接口获取景点详情
    const detailData = await getDetail(id);
    details.dt = detailData;

    // 动态设置导航栏标题为景点名称
    if (details.dt && details.dt.title) {
      uni.setNavigationBarTitle({
        title: details.dt.title,
      });
    }

    // 检查景点是否已经被收藏
    await checkFavoriteStatus();

    // const projectData = await detailProject()
    // projectList.value = projectData
  } catch (error) {
    console.error('获取数据失败:', error);
    uni.showToast({
      title: '获取数据失败',
      icon: 'error',
    });
  }
});
</script>
<style lang="scss">
@import './index.scss';
</style>
