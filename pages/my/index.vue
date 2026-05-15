<template>
  <view class="content">
    <view class="topBox">
      <view class="setbox">
        <view v-if="isLoggedIn()" class="icon-btn" @click="goToSettings">
          <uni-icons type="gear" size="30" color="#fff"></uni-icons>
        </view>
        <view class="icon-btn" @click="goToService">
          <uni-icons type="chat" size="30" color="#fff"></uni-icons>
        </view>
      </view>
      <view class="users" @click="setFun">
        <view class="u-top">
          <template v-if="!userInfo.nickName">
            <image src="/static/tabbar/my.png" mode="aspectFill"></image>
            <view class="tit"> 注册/登录 </view>
          </template>
          <template v-else="!userInfo.nickName">
            <image :src="userInfo.avatarUrl" mode="aspectFill"></image>
            <view class="tit">
              {{ userInfo.nickName }}
            </view>
          </template>
        </view>
        <view class="u-bottom">
          <view class="u-item">
            <view class="num">{{ preferenceStats.totalViewCount || 0 }}</view>
            <view class="u-tit"> 浏览 </view>
          </view>
          <view class="u-item">
            <view class="num">{{ preferenceStats.totalCollectCount || 0 }}</view>
            <view class="u-tit"> 收藏 </view>
          </view>
        </view>
      </view>
    </view>
    <view class="listBox">
      <view class="lists">
        <uni-list>
          <uni-list-item
            :show-extra-icon="true"
            :extra-icon="extraIcon1"
            showArrow
            title="个人信息"
            clickable
            @click="goToMyInformation"
          ></uni-list-item>
          <uni-list-item
            :show-extra-icon="true"
            :extra-icon="extraIcon3"
            showArrow
            title="我的评价"
            clickable
            @click="goToMyComments"
          ></uni-list-item>
        </uni-list>
      </view>
    </view>
    <up-popup closeable @close="close" :show="show" round="20">
      <view class="popup">
        <view class="title">获取您的昵称、头像</view>
        <view class="flex">
          <view class="label">获取用户头像：</view>
          <button class="avatar-warpper" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
            <image class="avatar" :src="userInfo.avatarUrl"></image>
          </button>
        </view>
        <view class="flex">
          <view class="label">获取用户昵称：</view>
          <input @input="changeName" type="nickname" />
        </view>
        <button size="default" type="primary" @click="userSubmit">确定</button>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { login, getUserInfo, updateUserInfo } from '../../api/login/index.js';
import { getPreferenceStats } from '../../api/home/index.js';

// 用户偏好统计信息
const preferenceStats = reactive({
  totalViewCount: 0,
  totalCollectCount: 0,
  totalPreferenceScore: 0,
  tagCount: 0,
});

onLoad(async () => {
  // 免登逻辑
  if (uni.getStorageSync('token') && !uni.getStorageSync('userInfo')) {
    const userData = await getUserInfo();
    userInfo.userId = userData.id;
    userInfo.avatarUrl = userData.avatarUrl;
    userInfo.nickName = userData.nickName;
    userInfo.gender = userData.gender ?? 0;
    userInfo.phone = userData.phone || '';
    userInfo.email = userData.email || '';
    uni.setStorageSync('userInfo', JSON.stringify(userInfo));
  } else if (uni.getStorageSync('token') && uni.getStorageSync('userInfo')) {
    const { id, avatarUrl, nickName, gender, phone, email } = JSON.parse(uni.getStorageSync('userInfo'));
    userInfo.userId = id;
    userInfo.avatarUrl = avatarUrl;
    userInfo.nickName = nickName;
    userInfo.gender = gender ?? 0;
    userInfo.phone = phone || '';
    userInfo.email = email || '';
    // 如果没有 userId，重新获取
    if (!userInfo.userId) {
      const userData = await getUserInfo();
      userInfo.userId = userData.id;
      userInfo.avatarUrl = userData.avatarUrl;
      userInfo.nickName = userData.nickName;
      userInfo.gender = userData.gender ?? 0;
      userInfo.phone = userData.phone || '';
      userInfo.email = userData.email || '';
      uni.setStorageSync('userInfo', JSON.stringify(userInfo));
    }
  }

  // 获取用户偏好统计信息
  if (uni.getStorageSync('token')) {
    try {
      const statsData = await getPreferenceStats();
      if (statsData) {
        preferenceStats.totalViewCount = statsData.totalViewCount || 0;
        preferenceStats.totalCollectCount = statsData.totalCollectCount || 0;
        preferenceStats.totalPreferenceScore = statsData.totalPreferenceScore || 0;
        preferenceStats.tagCount = statsData.tagCount || 0;
      }
    } catch (error) {
      console.error('获取偏好统计失败:', error);
    }
  }
});

const extraIcon1 = reactive({
  color: '#666666',
  size: '22',
  type: 'auth',
});
const extraIcon3 = reactive({
  color: '#666666',
  size: '22',
  type: 'chatboxes',
});

const userInfo = reactive({
  userId: '',
  nickName: '',
  avatarUrl: '',
  gender: '',
  phone: '',
  email: '',
});

const isLoggedIn = () => {
  return !!uni.getStorageSync('token')
}

// 控制弹出层的显示
const show = ref(false);

const close = () => {
  show.value = false;
};

const userSubmit = async () => {
  // 1. 基础校验
  if (!userInfo.avatarUrl) {
    uni.showToast({ title: '请选择头像', icon: 'none' });
    return;
  }
  if (!userInfo.nickName) {
    uni.showToast({ title: '请输入昵称', icon: 'none' });
    return;
  }

  uni.showLoading({ title: '保存中...' });

  try {
    await updateUserInfo({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
    });

    uni.setStorageSync('userInfo', JSON.stringify(userInfo));
    uni.showToast({ title: '保存成功', icon: 'success' });
    show.value = false;
  } catch (error) {
    console.error(error);
    uni.showToast({ title: error || '保存失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
};

const onChooseavatar = (e) => {
  userInfo.avatarUrl = e.detail.avatarUrl;
};
const changeName = (e) => {
  userInfo.nickName = e.detail.value;
};

const setFun = () => {
  uni.showModal({
    title: '温馨提示',
    content: '亲，授权微信登录后才能正常使用小程序',
    success(res) {
      if (res.confirm) {
        uni.login({
          success: async (data) => {
            console.log(data);
            const { token } = await login(data.code);
            console.log(token, 'token');
            uni.setStorageSync('token', token);
            // 根据token获取用户信息
            const userData = await getUserInfo();
            userInfo.userId = userData.id;
            userInfo.avatarUrl = userData.avatarUrl;
            userInfo.nickName = userData.nickName;
            userInfo.gender = userData.gender ?? 0;
            userInfo.phone = userData.phone || '';
            userInfo.email = userData.email || '';
            uni.setStorageSync('userInfo', JSON.stringify(userInfo));
            
            // 登录成功后获取偏好统计
            try {
              const statsData = await getPreferenceStats();
              if (statsData) {
                preferenceStats.totalViewCount = statsData.totalViewCount || 0;
                preferenceStats.totalCollectCount = statsData.totalCollectCount || 0;
                preferenceStats.totalPreferenceScore = statsData.totalPreferenceScore || 0;
                preferenceStats.tagCount = statsData.tagCount || 0;
              }
            } catch (error) {
              console.error('获取偏好统计失败:', error);
            }
            
            show.value = true;
          },
        });
      }
    },
  });
};

// 跳转到个人信息页面
const goToMyInformation = () => {
  uni.navigateTo({
    url: '/pages/my/myInformation/index',
  });
};

// 跳转到我的评论页面
const goToMyComments = () => {
  uni.navigateTo({
    url: '/pages/my/comments/index',
  });
};

// 跳转到设置页面
const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/my/settings/index',
  });
};

// 跳转到客服页面
const goToService = () => {
  uni.navigateTo({
    url: '/pages/my/service/index',
  });
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
