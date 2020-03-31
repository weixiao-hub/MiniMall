/**
 * 1.页面加载时，渲染购物车中 checked为true的商品
 * 2.微信支付
 *  1.那些人 那些账户可以实现微信支付
 *    1.企业账户
 *     2.企业账号的小程序后台必须给开发者添加白名单 
 *        1.一个appid可以同时绑定多个开发者
 *        2.这些开发者就可以公用这些appid 和它的开发权限
 * */

import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from '../../utils/utilsWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { request } from '../../request/index.js'

Page({
  data: {
    // 收货地址
    address: {},
    // 购物车数据
    cart: [],

    // 总价格
    totalPrice: 0,
    // 总数量：
    totalNum: 0,
  },
  onShow() {
    // 1.获取缓存中的收货地址
    const address = wx.getStorageSync('address')
    // 2.获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    // 选出购物车中被勾选的商品
    cart = cart.filter(v => v.checked)
    // 6.重新计算全选和总价格
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(item => {
      if (item.checked) {
        totalPrice += item.num * item.goods_price;
        totalNum += item.num
      }
    })
    this.setData({
      cart, totalPrice, totalNum, address
    })
  },
  async handleOrderPay() {
    try {
      // 判断订单中有没有token
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return
      }
      // 创建订单
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      // 准备发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      // 发起 预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      // 发起微信支付 
      await requestPayment(pay);
      // 查询后台 订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      await showToast({ title: "支付成功" });
      //  手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      // 支付成功了 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }
  }
})