<template>
  <view class="service">
    <view class="service-tip">
      <text>如有疑问，请联系维护者</text>
    </view>
    <view class="service-content">
      <view class="service-item">
        <text class="label">维护者电话：</text>
        <text class="value">1515527532</text>
      </view>
      <view class="service-item">
        <text class="label">工作时间：</text>
        <text class="value">周一至周五 9:00-18:00</text>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>

<style lang="scss">
.service {
  padding: 40rpx 30rpx;

  .service-tip {
    text-align: center;
    font-size: 32rpx;
    color: #333;
    margin-bottom: 60rpx;
    font-weight: bold;
  }

  .service-content {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;

    .service-item {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: #666;
        font-size: 28rpx;
      }

      .value {
        color: #333;
        font-size: 28rpx;
      }
    }
  }
}
</style>