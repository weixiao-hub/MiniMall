import { getSetting, chooseAddress, openSetting, showModal,showToast } from '../../utils/utilsWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
// 一、获取用户的收货功能
/**
 * 1.绑定点击事件
 * 2.调用小程序内置的Api ，获取用户的收货地址 wx.chooseAddress
 *  获取用户对小程序授予的获取地址的权限状态 定义为 scope
 * 1.加上用户点击获取收货地址的确定框   authSetting
 * scope 为 true
 * 2. 用户点击收货地址后，有点击了取消  scope为false
 * 3.假设用户没有调用过收货地址的api 则 scope 为 undefined
 * 
 * 所以得出结论： 当scope 为 true 和 undefined 时，可以直接调用 获取收货地址
 *  当用户拒绝过一次后，scope为false， 提示用户打开授权页面，让用户重新授权
 * 4. 把获取到的地址存储到本地
 * 
 * 
*/
// 二、页面加载完毕
/**
 * 1. 获取本地存储中的地址数据
 * 2. 把数据设置给data中的一个变量
*/
// 三、渲染数据
/**0.在详情页面，点击购物车时，添加checked属性为true
 * 1. 获取缓存中的数据
 * 把购物车数据，填充到data中
 * 全选按钮：只有有一个按钮为false ，全选按钮为false。点击全选按钮，所有的按钮都为true every方法
 * 总价格，总数量
 * 都需要勾选才计算
 * 遍历购物车数组，判断商品是否被选中 总价格 = 商品的数量 * 单价 
 * 总数量 = 勾选中几个商品
 * 
 * 商品的选中
 * 修改商品的checked
 * 
 * 全选和反选
 * bindchange
 * 获取data中的全选变量 allChecked
 * 取反，然后变量购物车，重新计算价格和数量
 * 
 * 商品数量的编辑功能
 * + -  绑定同一个点击事件，用自定义属性区分操作
 * 获取商品的id，对商品数量进行更改
 * 如果商品数量为0，则删除该商品
 * 重新更改cart缓存
 * 
 * 点击结算
 * 有没有收获地址
 * 有米有选中商品
 * 经过验证后，跳转到支付页面
*/
Page({
  data: {
    // 收货地址
    address: {},
    // 购物车数据
    cart: [],
    // 全选按钮
    AllChecked: false,
    // 总价格
    totalPrice: 0,
    // 总数量：
    totalNum: 0,
  },
  onShow() {
    // 1.获取缓存中的收货地址
    const address = wx.getStorageSync('address')
    // 2.获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ address })
    this.setCart(cart);


  },
  // 点击添加收货地址
  async handleAddAddress() {
    try {
      // 1.获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting['scope.address'];
      // 2.判断权限状态
      if (scopeAddress === false) {
        // 4.如果没有授权，则诱导用户打开授权
        await openSetting();
      }
      // 5.调用收货地址api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      wx.setStorageSync('address', address)
    } catch (err) {

    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id

    // 2.获取购物车数组
    let { cart } = this.data
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4.选择状态取反
    cart[index].checked = !cart[index].checked
    this.setCart(cart)




  },
  // 点击全选按钮
  handleAllChecked() {
    let { cart, AllChecked } = this.data
    AllChecked = !AllChecked;
    cart.forEach(v => v.checked = AllChecked);
    this.setCart(cart)
  },
  // 商品数量编辑
  async handleItemEdit(e) {


    const { operation, id } = e.currentTarget.dataset;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行
    if (cart[index].num === 1 && operation === -1) {
      // 弹出提示窗
      const res = await showModal({ content: '是否要删除该商品' })
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart)
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart)
    }

  },
  // 点击结算
  async handlePay() {
    const {totalNum,address} = this.data
    // 判断有没有收货地址
    if(!address.userName){
      await showToast({title:'请添加收货地址'}) 
      return
    }
    // 判断有没有选中商品
    if(!totalNum) {
      await showToast({title:'请选择要购买的商品'}) 
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })

  },
  // 设置购物车状态同时，重新计算 底部工具栏的数据：全选，总价格，总数量
  setCart(cart) {
    // 6.重新计算全选和总价格
    let AllChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(item => {
      if (item.checked) {
        totalPrice += item.num * item.goods_price;
        totalNum += item.num
      } else {
        AllChecked = false
      }
    })
    // 判断cart数组是否为空
    AllChecked = cart.length === 0 ? false : AllChecked
    this.setData({
      cart, AllChecked, totalPrice, totalNum
    })
    wx.setStorageSync('cart', cart)

  }


})