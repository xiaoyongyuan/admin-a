export default {
    menus: [ 
    //超级管理员
        { key: '/app/dashboard/index', title: '管理员首页', icon: 'mobile', component: 'Dashboard' },
        {
            key: '/app/adminacc', title: '账号管理', icon: 'team',
            subs: [
                { key: '/app/adminacc/adminteam', title: '维护团队管理', component: 'Adminteam'},
                { key: '/app/adminacc/admindeveice', title: '设备管理', component: 'Admindeveice'},
                { key: '/app/adminacc/adminduser', title: '单位管理', component: 'AdmindUser'},        
            ],
        },
        { key: '/app/adminequipment/index', title: '设备信息', icon: 'camera', component: 'AdminEquipment' },
        { key: '/app/alarmsta', title: '报警管理', icon: 'alert',
            subs: [
                { key: '/app/alarmsta/index', title: '报警统计', component: 'Alarmsta'},
                { key: '/app/alarmsta/onealarm', title: '一次报警', component: 'OneAlarm'},
            ],
        },
        { key: '/app/serverinfo/index', title: '服务器信息', icon: 'desktop', component: 'ServerInfo' },
        
    ],
    // 非菜单相关路由
    others: [
            {
        key: '/subs4', title: '页面', icon: 'switcher',
        subs: [
            { key: '/login', title: '登录' },
            { key: '/404', title: '404' },
        ],
        },
    ]
}

