/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from 'react-loadable';
import Loading from './widget/Loading';
import Dashboard from './dashboard/Dashboard';
//账号管理
import Adminteam from './adminacc/Adminteam';
import Admindeveice from './adminacc/Admindeveice';
import AdmindUser from './adminacc/adminduser';
import policeAcc from './adminacc/policeAcc';


//设备管理
import AdminEquipment from './adminequipment/index';
import AsynHistory from './adminequipment/AsynHistory';


//报警统计
import Alarmsta from './alarmsta/index';
import OneAlarm from './alarmsta/onealarm';
import selectDev from './alarmsta/selectDev';


//服务器信息
import ServerInfo from './serverinfo/index';

//公共组件
import CascaderModule from './common/CascaderModule';

const WysiwygBundle = Loadable({ // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    Dashboard, 
    WysiwygBundle

    , Adminteam, Admindeveice, AdmindUser, policeAcc
    , AdminEquipment, AsynHistory
    ,Alarmsta, OneAlarm,selectDev
    ,ServerInfo
    ,CascaderModule

}