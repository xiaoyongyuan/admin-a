/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from 'react-loadable';
import Loading from './widget/Loading';
import Dashboard from './dashboard/Dashboard';
//超级管理员
import Adminteam from './adminacc/Adminteam';
import Admindeveice from './adminacc/Admindeveice';

//管理员查看设备
import AdminEquipment from './adminequipment/index';



const WysiwygBundle = Loadable({ // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    Dashboard, 
    WysiwygBundle

    
    , Adminteam, Admindeveice
    , AdminEquipment
   


}