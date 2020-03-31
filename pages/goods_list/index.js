/**
 * 用户上划，触底加载下一页
 * 1.触发触底事件
 * 2.判断还有没有下一页
 *   获取总页数，获取当前页数，判断
 *  当前页：pagenum
 *  总页数：总条数 / 页容量
 * 3.有则加载，没有则弹出提示
 *   有下一页数据：当前页面+1 重新请求数据， 把下一页的数据拼接到上一页后面
 * 
 * 
 * 下拉刷新页面（需要在json文件中开启你一个配置）
 * 1. 触发下拉刷新事件
 * 2. 重置商品数据
 * 3.重置页码
 * 4.重新发送网络请求
 * 5. 请求到数据后关闭下拉等待效果
 */

import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "综合",
      isActive: true
    },
    {
      id: 1,
      value: "销量",
      isActive: false
    },
    {
      id: 2,
      value: "价格",
      isActive: false
    }],
    goods_list: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  TotalPages: 1,
  // 根据子组件传递过来的索引改变样式
  currentIndex(e) {
    let tabs = this.data.tabs
    tabs.forEach(item => {
      if (e.detail === item.id) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    })
    this.setData({
      tabs,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''
    
    this.getGoodsList()
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 1000)
  },
  // 获取商品列表的数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    // 获取总条数
    const total = res.total;

    this.TotalPages = Math.ceil(total / this.QueryParams.pagesize)

    this.setData({
      // 拼接数组
      goods_list: [...this.data.goods_list, ...res.goods]
    })
    // 关闭下拉刷新窗口
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 触底事件
  onReachBottom() {
    // 判断有没有下一页
    if (this.QueryParams.pagenum >= this.TotalPages) {
      wx.showToast({
        title: '到底部了',
      })

    } else {
      this.QueryParams.pagenum++
      this.getGoodsList()

    }

  },
  // 监听下拉事件
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goods_list: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1
    // 重新发送网络请求
    this.getGoodsList();
  }
})