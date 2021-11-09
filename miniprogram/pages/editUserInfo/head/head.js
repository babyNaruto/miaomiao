// pages/editUserInfo/head/head.js
const app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userPhoto: ''
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
            userPhoto: app.userInfo.userPhoto
        })

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

    //点击头像修改头像
    handleUploadImage(){
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res)=> {
                console.log(res)
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths[0];
              this.setData({
                  userPhoto: tempFilePaths
              });
            }
          })
    },
    //将图片上传到数据库,1.需要将先图片存储
    handleBtn(){
        //友好提示
        wx.showLoading({
          title: '上传中',
        })
        let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + ".jpg";
        //!存在的问题，图片存取会有缓存存在，导致无法时时更新图片
        
        wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: this.data.userPhoto, // 文件路径
          }).then((res) =>{
            
            // console.log(res);
            let fileID = res.fileID;
            //2.将fileID存到数据库
            if(fileID){
              db.collection('users').doc(app.userInfo._id).update({
                data: {
                  userPhoto: fileID
                }
              }).then((res) =>{
                wx.hideLoading();
                wx.showToast({
                title: '上传成功！',
                 });
                 app.userInfo.userPhoto = fileID;
              })
            }
          });
    },
    bindGetUserInfo(ev){
      let userInfo = ev.detail.userInfo;
      if(userInfo){
          this.setData({
              userPhoto: userInfo.avatarUrl
          }, ()=>{
            wx.showLoading({
              title: '更换中',
            })
            db.collection('users').doc(app.userInfo._id).update({
              data: {
                userPhoto: userInfo.avatarUrl
              }
            }).then((res) =>{
              wx.hideLoading();
              wx.showToast({
              title: '更换成功！',
               });
               app.userInfo.userPhoto = userInfo.avatarUrl;
            });
          })
      }
    }
})