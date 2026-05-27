<template>
  <view class="detail">
    <image :src="formatImageUrl(details.dt.img)" mode="aspectFill"></image>
    <view class="d-content">
      <!-- 拥堵预警提示 -->
      <up-alert
        v-if="showAlert"
        title="当前景区拥堵，建议错峰出行"
        type="warning"
        :closable="true"
        @close="showAlert = false"
      />
      <!-- 热门提示 -->
      <up-alert
        v-if="showHotAlert"
        title="当前景区较热门，人流量较大"
        type="primary"
        :closable="true"
        @close="showHotAlert = false"
      />
      <view class="tit">
        <!-- 左侧：标题 + 标签 -->
        <view class="title-left">
          <text style="margin-right: 7px; font-size: 17px">{{ details.dt.title }}</text>
          <view style="display: flex; gap: 8rpx; flex-wrap: wrap">
            <uni-tag
              v-for="tag in details.dt.tags"
              :key="tag.id"
              :text="tag.name"
              size="small"
              type="primary"
            />
          </view>
        </view>
        <!-- 右侧：收藏图标 -->
        <view v-if="isLoggedIn()" class="icon-right">
          <uni-icons
            :type="isFavorite ? 'heart-filled' : 'heart'"
            :color="isFavorite ? '#ff4d4f' : '#999'"
            size="30"
            @click="handleFavorite"
            style="cursor: pointer"
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
        <view class="jj" style="margin-top: 20rpx" @click="goComments">
          <text style="font-weight: 700; font-size: 14px">景点评论</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 推荐景点模块 -->
      <view v-if="isLoggedIn() && recommendList.length > 0" class="recommend-section">
        <view class="recommend-header">
          <text class="recommend-title">推荐景点</text>
          <text class="recommend-subtitle">根据标签推荐</text>
        </view>
        <view class="recommend-list">
          <up-waterfall v-model="recommendList" ref="recommendWaterfall">
            <template v-slot:left="{ leftList }">
              <ScenicSpot v-for="(item,index) in leftList" :key="index" :item="item" :index="index" @click="goDetail"></ScenicSpot>
            </template>
            <template v-slot:right="{ rightList }">
              <ScenicSpot v-for="(item,index) in rightList" :key="index" :item="item" :index="index" @click="goDetail"></ScenicSpot>
            </template>
          </up-waterfall>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, reactive } from 'vue';
import { getDetail, getHomeList } from '../../api/home/index.js';
import { addFavorite, removeFavorite, getFavorites } from '../../api/like/index.js';
import ScenicSpot from '../../components/scenicSpot/index.vue';

const details = reactive({
  dt: {},
});

const isFavorite = ref(false);
const showAlert = ref(false);
const showHotAlert = ref(false);
const recommendList = ref([]);
const fromFavorites = ref(false);

onShow(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const prevPage = pages[pages.length - 2];
  if (prevPage) {
    const prevRoute = prevPage.route || '';
    fromFavorites.value = prevRoute.includes('like') || prevRoute.includes('favorites');
  }
});

const isLoggedIn = () => {
  return !!uni.getStorageSync('token')
}

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

const goComments = () => {
  uni.navigateTo({
    url: `/pages/comment/index?id=${details.dt.id}&title=${encodeURIComponent(details.dt.title)}&fromFavorites=${fromFavorites.value}`,
  });
};

const goDetail = (item) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${item.id}`
  });
};

// 根据标签获取推荐景点
const fetchRecommendList = async () => {
  try {
    if (!details.dt.tags || details.dt.tags.length === 0) {
      return;
    }

    // 构建查询参数
    const params = {};
    let hasValidTag = false;

    // 遍历标签，仅提取三级标签(c3Code)和属性标签(propertyCode)
    for (const tag of details.dt.tags) {
      if (tag.code) {
        if (tag.code.startsWith('C3_')) {
          // 三级标签
          params.c3Code = tag.code;
          hasValidTag = true;
        } else if (tag.code.startsWith('P_')) {
          // 属性标签
          params.propertyCode = tag.code;
          hasValidTag = true;
        }
      }
    }

    // 只有有三级标签或属性标签时才展示推荐模块
    if (!hasValidTag) {
      return;
    }

    // 按标签查询相关景点
    const result = await getHomeList(params);
    // 前端过滤掉当前景点
    recommendList.value = result.filter(item => item.id !== details.dt.id);
  } catch (error) {
    console.error('获取推荐景点失败:', error);
  }
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

    // 检查拥堵预警状态
    if (details.dt.hotStatus === 3) {
      showAlert.value = true;
    } else if (details.dt.hotStatus === 2) {
      showHotAlert.value = true;
    }

    // 检查景点是否已经被收藏
    await checkFavoriteStatus();

    // 获取推荐景点列表
    await fetchRecommendList();

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

.recommend-section {
  margin-top: 30rpx;
  padding-top: 20rpx;
  border-top: 1px solid #eee;
}

.recommend-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 20rpx;
  padding: 0 10rpx;

  .recommend-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-right: 10rpx;
  }

  .recommend-subtitle {
    font-size: 24rpx;
    color: #999;
  }
}

.recommend-list {
  padding: 0 10rpx;
}
</style>
