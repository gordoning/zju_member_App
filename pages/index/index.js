//index.js

const AV = require('../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../utils/av-live-query-weapp-min');
// const Order = require('../../model/order');

//获取应用实例
const app = getApp()

Page({
  data: {
    amount:0.03,
    phone:13616187656,
    name:'林国之',
    all_member_year: [2017,2018,2020],
    memberIndex:1,
    member_year:'2017'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // 姓名
  editName: function (e) {
    this.setData({
      name: e.detail.value
    });
    console.log(this.data.name);
  },

  // 手机号
  editPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
    console.log(this.data.phone);
  },

  // 费用
  editAmount: function(e){
    this.setData({
      amount: e.detail.value
    });
    console.log(this.data.amount);
  },

  //会员年份
  bindMemberYearChange: function(e){
    this.setData({
      memberIndex: e.detail.value,
      member_year : this.data.all_member_year[e.detail.value]
    });
    console.log(this.data.member_year);
  },

  //登录
  login: function() {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp()).catch(error => console.error(error.message));
  },

  onReady: function() {
    this.login();
    console.log(AV.User.current())
  },

  //缴纳会费
  donate() {
    const params = {
      amount:parseFloat(this.data.amount),
      phone:parseInt(this.data.phone),
      name:this.data.name,
      member_year:parseInt(this.data.member_year)
    }

    console.log(params);

    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
    Cloud.run('order', params).then((data) => {
      wx.hideToast();
      data.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        });
        // setTimeout(this.refreshOrders.bind(this), 1500);
      }
      data.fail = ({
        errMsg
      }) => this.setData({
        error: errMsg
      });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({
        error: error.message
      });
      wx.hideToast();
    })
  }
})