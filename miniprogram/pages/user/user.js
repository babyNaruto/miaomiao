// pages/user/user.js
const app = getApp()

//初始化数据库

const db = wx.cloud.database()
const _ = db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userPhoto: "/images/user/user_unlogin.png",
        nickName: "naruto",
        logged: false,
        disabled: true,
        id: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    //云函数自动登录实现
    onReady: function () {
        this.getLocation();
        wx.cloud.callFunction({
            name: 'login',
            data: {}
        }).then((res) =>{
            // console.log(res);
            //查询用户openID
            db.collection('users').where({
                _openid: res.result.openid
            }).get().then((res) =>{
                if(res.data.length){
                //查到的结果重新给userInfo
                app.userInfo = Object.assign( app.userInfo, res.data[0]);
                // console.log(res.data);
                //查到结果渲染页面，自动登录
                this.setData({
                    userPhoto: app.userInfo.userPhoto,
                    nickName: app.userInfo.nickName,
                    logged: true,
                    id: app.userInfo._id
                });
                this.getMessage();
                } else{
                    this.setData({
                        disabled: false
                    })
                }


            })
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //设置中修改的信息同步到用户信息页面
        this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            id: app.userInfo._id
        })

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

    //用户授权登录，存储信息到数据库中
    bindGetUserInfo: function (ev) {
        //console.log(ev);
        let userInfo = ev.detail.userInfo;
        if(!this.data.logged && userInfo){
            //存入数据库
            db.collection('users').add({
                data: {
                    userPhoto: userInfo.avatarUrl,
                    nickName: userInfo.nickName,
                    signature: '',
                    phoneNumber: '',
                    weixinNumber: '',
                    links: 0,
                    time: new Date(),
                    isLocation: true,
                    friendList: [],
                    longitude: this.longitude,
                    latitude: this.latitude,
                    location: db.Geo.Point(this.longitude, this.latitude)
                }


            }).then((res) =>{
                //拿到数据库，更新数据显示到页面上
                //console.log(res);
                db.collection('users').doc(res._id).get().then((res) =>{
                    // console.log(res.data)
                    app.userInfo = Object.assign(app.userInfo, res.data)
                    this.setData({
                        userPhoto: app.userInfo.userPhoto,
                        nickName: app.userInfo.nickName,
                        logged: true,
                        id: app.userInfo._id
                    })
                })
            });

        }
    },

    getMessage() {
        db.collection('message').where({
            userId: app.userInfo._id
        }).watch({
            onChange: function(snapshot) {
                // console.log(snapshot)
                if(snapshot.docChanges.length){
                    let list = snapshot.docChanges[0].doc.list;
                    if(list.length){
                        wx.showTabBarRedDot({
                          index: 2
                        });
                        //全局更新消息队列
                        app.userMessage = list;
                    }
                    else{
                        wx.hideTabBarRedDot({
                          index: 2
                        })
                        app.userMessage = []
                    }
                }
              },
            onError: function(err) {
            console.error('the watch closed because of error', err)
            }
             
        })
    },
    getLocation(){
        wx.getLocation({
            type: 'gcj02',
            success : (res)=>{
              this.latitude = res.latitude;
              this.longitude = res.longitude;
            }
           })
    }
})