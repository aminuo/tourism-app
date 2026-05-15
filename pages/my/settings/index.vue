<template>
  <view class="settings">
    <view class="logout-btn" @click="handleLogout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup>
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/home/index'
          })
        }, 1000)
      }
    }
  })
}
</script>

<style lang="scss">
.settings {
  padding: 20rpx;

  .logout-btn {
    background-color: #fff;
    padding: 30rpx;
    text-align: center;
    color: #e74d3d;
    border-radius: 8rpx;
  }
}
</style>