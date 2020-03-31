/**
 * 1发送请求获取数据
 * 2. 点击轮播图预览大图
 *  给轮播图绑定点击事件
 *  调用小程序的api previewImage
 * 
 * 3.点击加入购物车
 *  1.绑定点击事件
 *  2.获取缓存中的购物车数据，数组格式
 *  3.先判断当前的商品是否已经存在于购物车
 *    存在，更改商品数量，重新把购物车数组填充回缓存中
 * 
 *    不存在，直接添加到购物车数组，带上购买数量属性，把购物车数组填充回缓存中
 *    弹出提示
 * 
 * 商品收藏
 * 页面onshow的时候，加载页面中的缓存的商品收藏
 * 判断当前商品是否收藏
 * 是  -》 改变图标
 *  点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 * */

import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  //商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options
    this.getGoodsInfo(goods_id)
  },
  // 获取商品详情数据
  async getGoodsInfo(goods_id) {
    let goodsObj = await request({ url: '/goods/detail', data: { goods_id } })
    this.GoodsInfo = goodsObj;
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        //  inphone 部分手机不识别webp图片格式
        // 1.找后台，让他修改
        // 2. 临时自己改，确保后台存在webp格式，改成jpg格式
        goods_introduce: goodsObj.goods_introduce.replace('/\.webp/', '.jpg'),
        pics: goodsObj.pics,
      },
      isCollect
    })

  },
  // 点击轮播图放大预览
  handlePrevewImage(e) {
    // 1.构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(item => item.pics_mid);
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      // current表示点击的谁
      // 2.接收传递过来的url

      current,
      urls,
    })
  },
  // 点击加入购物车
  handleCartAdd() {
    // 1.获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || [];
    // 2.判断商品对象是否存在于购物车的数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 表示数组不存在,第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 购物车已经存在该商品，则商品数量+1
      cart[index].num++
    }
    //把购物车数组重新放入缓存中
    wx.setStorageSync('cart', cart)
    // 弹出提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true,

    })
  },
  // 点击收藏
  shoucang() {
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index！=-1表示 已经收藏过 
    if (index !== -1) {
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });

    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性  isCollect
    this.setData({
      isCollect
    })
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

  }
})