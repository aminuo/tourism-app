<template>
  <view class="comment">
    <view class="comment-header">
      <text class="scenic-title">{{ scenicTitle }}</text>
      <text class="comment-count">共 {{ commentList.length }} 条评论</text>
    </view>

    <!-- 评论列表 -->
    <view class="comment-list">
      <view v-if="loading" class="loading-tip">
        <text>加载中...</text>
      </view>
      <view v-else-if="commentList.length === 0" class="empty-tip">
        <text>暂无评论，快来抢沙发吧~</text>
      </view>
      <view v-for="(item, index) in commentList" :key="item.id" class="comment-item">
        <view class="comment-user">
          <image :src="item.avatarUrl || '/static/tabbar/my.png'" class="avatar"></image>
          <view class="user-info">
            <text class="username">{{ item.nickName || '用户' + item.userId }}</text>
            <text class="date">{{ formatDate(item.createTime) }}</text>
          </view>
        </view>
        <view class="comment-content">
          <text>{{ item.content }}</text>
        </view>
        <view class="comment-rating">
          <uni-rate :value="item.score" readonly size="14" color="#ffd700" />
        </view>
      </view>
    </view>

    <!-- 写评论按钮 -->
    <view class="add-btn-area">
      <button class="add-btn" @click="goAddComment">
        <uni-icons type="compose" size="24" color="#fff"></uni-icons>
        <text>写评论</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getComments } from '../../api/home/index.js';

const scenicTitle = ref('');
const scenicId = ref('');
const loading = ref(false);
const commentList = ref([]);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

const fetchComments = async () => {
  loading.value = true;
  try {
    const data = await getComments({ scenicId: scenicId.value });
    commentList.value = data || [];
  } catch (error) {
    console.error('获取评论失败:', error);
    // 使用模拟数据
    commentList.value = [
      {
        id: 1,
        userId: 1,
        scenicId: scenicId.value,
        content: '风景非常优美，值得一去！',
        score: 5,
        createTime: '2026-05-04T10:00:00',
        status: 1,
        avatarUrl: '/static/tabbar/my.png',
        nickName: '游客001',
      },
      {
        id: 2,
        userId: 2,
        scenicId: scenicId.value,
        content: '人有点多，建议早上早点去。',
        score: 4,
        createTime: '2026-05-04T11:30:00',
        status: 1,
        avatarUrl: '/static/tabbar/my.png',
        nickName: '游客002',
      },
      {
        id: 3,
        userId: 3,
        scenicId: scenicId.value,
        content: '设施完善，讲解很专业。',
        score: 5,
        createTime: '2026-05-03T15:20:00',
        status: 1,
        avatarUrl: '/static/tabbar/my.png',
        nickName: '游客003',
      },
    ];
  } finally {
    loading.value = false;
  }
};

const goAddComment = () => {
  uni.navigateTo({
    url: `/pages/comment/add/index?id=${scenicId.value}&title=${encodeURIComponent(scenicTitle.value)}`,
  });
};

onLoad((options) => {
  if (options.id) {
    scenicId.value = options.id;
  }
  if (options.title) {
    scenicTitle.value = decodeURIComponent(options.title);
    uni.setNavigationBarTitle({
      title: scenicTitle.value + '-评论',
    });
  }

  fetchComments();
});

onShow(() => {
  // 从写评论页面返回时刷新评论列表
  fetchComments();
});
</script>
<style lang="scss">
@import './index.scss';
</style>
