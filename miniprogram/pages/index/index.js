// pages/index/index.js
//
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'https://img2.baidu.com/it/u=331362266,3772279129&fm=253&fmt=auto&app=120&f=JPEG?w=750&h=500',

            'https://img1.baidu.com/it/u=722430420,1974228945&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
      
            'https://img2.baidu.com/it/u=2663305352,783996922&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313'
        ],
        listData: [],
        current:  'links'
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
        this.getListData();
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
    handleLinks(ev){
        let id = ev.target.dataset.id;
       /*  db.collection('users').doc(id).update({
            data: {
                links: 5
            }
        }).then((res) =>{
            
        })
        !小程序权限问题，无法修改别人数据，需要通过云函数来操作
        */
       //调用云函数
       wx.cloud.callFunction({
           name: 'update',
           data: {
               collection: 'users',
               doc: id,
               data: "{links: _.inc(1)}"
           }
       }).then((res) =>{
        //    console.log(res);
        let updated = res.result.stats.updated;
        if(updated){
            let cloneListDate = [...this.data.listData];
            for(let i = 0; i < cloneListDate.length; i++){
                if(cloneListDate[i]._id == id){
                   cloneListDate[i].links++; 
                }
            }
            this.setData({
                listData: cloneListDate
            })
        }

       });
    },
    handleCurrent(ev){
        let current = ev.target.dataset.current;
        if(current == this.data.current){
            return false;
        }
        this.setData({
            current
        }, ()=>{
            this.getListData()
        });
        
    },
    getListData(){
        db.collection('users').field({
            userPhoto: true,
            nickName: true,
            links: true
        })
        .orderBy(this.data.current, "desc")
        .get()
        .then((res) =>{
            // console.log(res.data)
            this.setData({
              listData: res.data  
            })
        });
    },

    //详情页的跳转

    handleDetail(ev){
        let id = ev.target.dataset.id;
        wx.navigateTo({
          url: '/pages/detail/detail?userId=' + id
        })
    }

})