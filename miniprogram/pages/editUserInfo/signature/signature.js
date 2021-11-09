// pages/editUserInfo/signature/signature.js
const app = getApp()
const db = wx.cloud.database()


Page({

    /**
     * 页面的初始数据
     */
    data: {
        signature: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            signature: app.userInfo.signature
        });
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
    handleText: function(ev){
        //边输入边更新渲染
        let value = ev.detail.value;
        this.setData({
            signature: value
        });
    },

    handleBtn: function(){
        this.updateSignature();
    },

    updateSignature: function(){
        //写入数据库
        //获取集合中指定记录的引用。方法接受一个 id 参数，指定需引用的记录的 _id
        db.collection('users').doc(app.userInfo._id).update({
            data: {
                signature: this.data.signature
            }
        }).then((res) =>{
            wx.hideLoading();
            wx.showToast({
              title: '更新成功!',
            });
            app.userInfo.signature = this.data.signature;
        });
    }
})