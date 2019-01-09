export default {
    menus: [ 
    //超级管理员
        { key: '/app/dashboard/index', title: '管理员首页', icon: 'mobile', component: 'Dashboard' },
        {
            key: '/app/adminacc', title: '账号管理', icon: 'bars',
            subs: [
                { key: '/app/adminacc/adminteam', title: '维护团队管理', component: 'Adminteam'},
                { key: '/app/adminacc/admindeveice', title: '设备管理', component: 'Admindeveice'},
            ],
        },
        { key: '/app/adminequipment/index', identi:['comp','user'], title: '设备信息', icon: 'camera', component: 'AdminEquipment' },
       
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

