module.exports = {
    env: 'Test', // 必填 运行环境：  测试Test  上线Prod，上线审核开始要把环境改为Prod
    gameId: 'jzdds-byte-test', // 必填 游戏ID，去平台后台创建
    gameVersion: '0.0.1', // 必填 当前游戏版本号
    useApm: true, // 是否加载 apm 应用监控，默认false；
    useWall: true, // 是否加载 wallSDK 积分墙，默认false；
    useCross: true, // 是否加载 cross 交叉推广，默认false；
    getUserInfoBtn: { // 默认的获取用户信息按钮的样式
        type: 'image',
        image: 'http://wxmini-resource.hortorgames.com/background-image/btn_enter.png',
        style: { width: 200, height: 70, top: 200, left: 80 }
    },
    shareData: { // 默认分享数据
        title: '默认分享标题',
        query: 'key=val',
        imageUrl: 'http://wxmini-resource.hortorgames.com/background-image/share.png',
    },
    shareSuccessDiff: 2000, // 判断为分享成功的操作时间间隔，单位ms
    // openGetShareTheme: false, // 是否开启获取分享方案，默认开启
    // shareThemes: [''], // 默认加载某些类型的分享方案
    // logReportFrequency: 3000, // ms，日志上报频率，默认 3s
    // maxTempVideoAdLen: 3, // 可实例化视频广告实例上限，默认 3
    // stdAutoUpload: true, // 自动上报STD log
    // reportCaptureScreen: true,  // 用户截屏上报，默认关闭
    // reportSubscribeMessage: true, // 订阅消息上报，默认关闭
    // key: 'K8XrN1SLC776eAhI', // 积分墙key值
};
