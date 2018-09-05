Page({
    data: {
        url: ''
    },

    onLoad (option) {
        this.setData({
            url: decodeURIComponent(option.url)
        })
    }
});