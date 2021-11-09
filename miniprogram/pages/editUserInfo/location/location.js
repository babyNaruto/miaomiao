// pages/editUserInfo/location/location.js
const app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLocation: true

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            isLocation: app.userInfo.isLocation
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

    },
    switchChange(ev){
        // console.log(ev.detail.value)
        let value = ev.detail.value;
        this.setData({
            isLocation: value
        });
        //获取集合中指定记录的引用。方法接受一个 id 参数，指定需引用的记录的 _id
        db.collection('users').doc(app.userInfo._id).update({
            data: {
                isLocation: this.data.isLocation
            }
        }).then((res) =>{

        })
    }
})