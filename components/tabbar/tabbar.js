// components/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap(e) {
      // 传递索引给父组件
      const { index } = e.currentTarget.dataset

      this.triggerEvent('currentIndex', { index })
    }
  }
})
