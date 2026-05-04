<template>
  <view class="my-comments">
    <view class="comment-list">
      <view v-if="loading" class="loading-tip">
        <text>加载中...</text>
      </view>
      <view v-else-if="commentList.length === 0" class="empty-tip">
        <text>暂无评论记录</text>
      </view>
      <view
        v-for="item in commentList"
        :key="item.id"
        class="comment-item"
        @click="goToScenicDetail(item.scenicId)"
      >
        <view class="comment-header">
          <view class="scenic-name">{{ item.scenicName || '景点' + item.scenicId }}</view>
          <view class="comment-rating">
            <uni-rate :value="item.score" readonly size="14" color="#ffd700" />
          </view>
        </view>
        <view class="comment-content">
          <text>{{ item.content }}</text>
        </view>
        <view class="comment-footer">
          <text class="date">{{ formatDate(item.createTime) }}</text>
          <text class="delete-btn" @click.stop="deleteComment(item.id)">删除</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getComments } from '../../../api/home/index.js';

const loading = ref(false);
const commentList = ref([]);
const userId = ref('');

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fetchMyComments = async () => {
  loading.value = true;
  try {
    const userInfoStr = uni.getStorageSync('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      userId.value = userInfo.userId;
    }

    if (!userId.value) {
      uni.showToast({ title: '请先登录', icon: 'none' });
      commentList.value = [];
      return;
    }

    const data = await getComments({ userId: userId.value });
    commentList.value = data || [];
  } catch (error) {
    console.error('获取评论失败:', error);
    commentList.value = [];
  } finally {
    loading.value = false;
  }
};

const goToScenicDetail = (scenicId) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${scenicId}`,
  });
};

const deleteComment = (commentId) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条评论吗？',
    success: async (res) => {
      if (res.confirm) {
        uni.showToast({ title: '删除功能开发中', icon: 'none' });
      }
    },
  });
};

onLoad(() => {
  fetchMyComments();
});
</script>
<style lang="scss">
@import './index.scss';
</style>
