//logs.js
const util = require('../../utils/util.js')
const { Object, User, Query, Cloud } = require('../../utils/av-live-query-weapp-min');
const Order = Object.extend('Order');

Page({
  data: {
    logs: [],
    orders:[]
  },
  onLoad: function () {
    // console.log("开始刷新");
    
    // console.log(this.data.orders)
    
  },

  onReady: function(){
    // console.log(this.data.orders)
  },

  onShow: function(){
    console.log("开始显示");
    wx.showLoading({
      title: '正在查询中',
    })
    this.refreshOrders();
  },
  
  //拉取用户的订单
  refreshOrders: function() {
    console.log("开始调用");
    var that = this;
    var query = new Query('Order');
    query.equalTo('user', User.current());
    query.equalTo('status', 'SUCCESS');
    query.descending('createdAt').find().then(function (results) {
      const orders = results.map(function (order) { return order.toJSON() });
      that.setData({orders}) ;
      wx.hideLoading();
      // console.log(orders[0].paidAt.replace('T',' ').replace('.000Z',''));
      // console.log(orders[0].paidAt.formatTime(sjc, 'Y/M/D h:m:s'));
      if(that.data.orders.length === 0){
        wx.showModal({
          title: '未找到您的缴费记录',
          content: '请确认',
        })
      }

    }, function (error) {
      wx.showModal({
        title: '暂时无法获取',
        content: '请稍后再试',
      })
    });
  //   return new Query(Order)
  //     .equalTo('user', User.current())
  //     .equalTo('status', 'SUCCESS')
  //     .descending('createdAt')
  //     .find()
  //     .then(orders => this.setData({
  //       orders: orders
  //       })
  //     )
  //     .catch(error => console.error(error.message));
  }
})
