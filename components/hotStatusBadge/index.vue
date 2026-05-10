<template>
  <view
    v-if="shouldShow"
    class="hot-status-badge"
    :class="statusClass"
  >
    {{ statusText }}
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: Number,
    default: null,
  },
});

const shouldShow = computed(() => {
  return props.status !== undefined && props.status !== null;
});

const statusText = computed(() => {
  const statusMap = {
    0: '冷门',
    1: '正常',
    2: '热门',
    3: '拥堵预警',
  };
  return statusMap[props.status] || '';
});

const statusClass = computed(() => {
  const classMap = {
    0: 'status-cold',
    1: 'status-normal',
    2: 'status-hot',
    3: 'status-warning',
  };
  return classMap[props.status] || '';
});
</script>

<style lang="scss" scoped>
.hot-status-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  color: #fff;
  border-radius: 0 4rpx 0 4rpx;
  z-index: 1;

  &.status-cold {
    background-color: #999;
  }

  &.status-normal {
    background-color: #67c23a;
  }

  &.status-hot {
    background-color: #f56c6c;
  }

  &.status-warning {
    background-color: #e6a23c;
  }
}
</style>
