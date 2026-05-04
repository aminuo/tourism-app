<template>
  <view class="add-comment">
    <view class="form-header">
      <text class="title">写评论</text>
    </view>

    <view class="form-body">
      <!-- 景点信息 -->
      <view class="scenic-info">
        <text class="scenic-name">{{ scenicTitle }}</text>
      </view>

      <!-- 评分 -->
      <view class="form-item">
        <text class="label">评分</text>
        <view class="rating-wrapper">
          <uni-rate v-model="commentData.score" size="32" color="#ffd700" />
        </view>
      </view>

      <!-- 评论内容 -->
      <view class="form-item">
        <text class="label">评论内容</text>
        <textarea
          class="content-textarea"
          v-model="commentData.content"
          placeholder="请输入您的评论..."
          maxlength="500"
          :auto-height="true"
        />
        <view class="char-count">{{ commentData.content.length }}/500</view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-area">
      <button class="submit-btn" @click="handleSubmit" :disabled="!canSubmit">提交评论</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { submitComment } from '../../../api/home/index.js';

const scenicTitle = ref('');
const scenicId = ref('');

const commentData = reactive({
  score: 5,
  content: '',
});

const canSubmit = computed(() => {
  return commentData.score >= 1 && commentData.score <= 5 && commentData.content.trim().length > 0;
});

const handleSubmit = async () => {
  if (!canSubmit.value) {
    uni.showToast({ title: '请填写完整评论', icon: 'none' });
    return;
  }

  try {
    await submitComment({
      scenicId: parseInt(scenicId.value),
      content: commentData.content.trim(),
      score: commentData.score,
    });

    uni.showToast({
      title: '评论提交成功',
      icon: 'success',
      duration: 1500,
    });

    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    console.error('提交评论失败:', error);
    uni.showToast({ title: error || '提交失败', icon: 'none' });
  }
};

onLoad((options) => {
  if (options.id) {
    scenicId.value = options.id;
  }
  if (options.title) {
    scenicTitle.value = decodeURIComponent(options.title);
    uni.setNavigationBarTitle({
      title: '写评论',
    });
  }
});
</script>
<style lang="scss">
@import './index.scss';
</style>
