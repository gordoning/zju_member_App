//index.js

const AV = require('../../utils/av-live-query-weapp-min');
const { User, Query, Cloud } = require('../../utils/av-live-query-weapp-min');
// const Order = require('../../model/order');

//获取应用实例
const app = getApp()

Page({
  data: {
    amount:'',
    phone:'',
    name:'',
    all_member_year: [2018,2019],
    memberIndex:0,
    member_year:2018,
    major:'',
    graduateYear:'',
    company:'',
    homeAddress:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },


  //会员年份
  bindMemberYearChange: function (e) {
    this.setData({
      memberIndex: e.detail.value,
      member_year: this.data.all_member_year[e.detail.value]
    });
  },

  // 费用
  editAmount: function(e){
    this.setData({
      amount: e.detail.value
    });
  },


  // 姓名
  editName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  // 手机号
  editPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 专业
  editMajor: function (e) {
    this.setData({
      major: e.detail.value
    });
    console.log(this.data.major);
  },

  // 毕业年份
  editGraduateYear: function (e) {
    this.setData({
      graduateYear: e.detail.value
    });
    console.log(this.data.graduateYear);
  },

  // 工作单位
  editCompany: function (e) {
    this.setData({
      company: e.detail.value
    });
    console.log(this.data.company);
  },

  // 住址
  editHomeAddress: function (e) {
    this.setData({
      homeAddress: e.detail.value
    });
    console.log(this.data.homeAddress);
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

  test:function(){
    console.log('fdd');
    wx.switchTab({
      url: '../logs/logs'
    })
  },

  //缴纳会费
  donate() {
    const params = {
      amount:parseFloat(this.data.amount),
      phone:parseInt(this.data.phone),
      name:this.data.name,
      member_year:parseInt(this.data.member_year),
      major: this.data.major,
      graduateYear: parseInt(this.data.graduateYear),
      company: this.data.company,
      homeAddress: this.data.homeAddress
    }

    console.log(params);

    if (this.data.member_year.length === 0) {
      wx.showModal({
        title: '请选择会费类别',
        content: '',
      })
      return;
    }

    if (this.data.phone.length === 0) {
      wx.showModal({
        title: '请输入正确的手机号',
        content: '',
      })
      return;
    }

    if (this.data.name.length === 0) {
      wx.showModal({
        title: '请输入姓名',
        content: '',
      })
      return;
    }

    if (this.data.major.length === 0) {
      wx.showModal({
        title: '请填写您的专业',
        content: '',
      })
      return;
    }

    if (this.data.graduateYear.length === 0) {
      wx.showModal({
        title: '请填写您的毕业年份',
        content: '',
      })
      return;
    }


    if (this.data.amount < 0.02) {
      wx.showModal({
        title: '请您至少支付100元哦，谢谢您的支持',
        content: '您支付的会费，将直接入账‘浙江大学无锡校友会’的官方账户',
      })
      return;
    }

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
        setTimeout(wx.switchTab({
          url: '../logs/logs'
        }), 1500);
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
  },

  //分享小程序
  onShareAppMessage: function () {
    return {
      title: "浙大无锡校友会-会员",
      desc: '您的支持，是对校友会最大的肯定',
      path: '/pages/index/index'
    }
  }
})