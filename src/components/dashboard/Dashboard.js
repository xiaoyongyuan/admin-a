
import React from 'react';
import { Row,Col,Card } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import EchartsViews from './EchartsViews';
import EchartsProjects from './EchartsProjects';
import Calpolice from "./Calpolice";
import Onlineeq from './Onlineeq';
import Classifiedaccess from './Classifiedaccess';
import '../../style/publicStyle/publicStyle.css';
import '../../style/ztt/css/Companyhome.css';
import {post} from "../../axios/tools";
import moment from "moment";
//图片
import weihutuandui from '../../style/ztt/img/weihutuandui.png';
import house from '../../style/ztt/img/qiyeyonghu.png';
import baojing from '../../style/ztt/img/baojing.png';
import users from '../../style/ztt/img/gerenyonghu.png';
import baojingIcon from '../../style/ztt/img/baojingIcon.png';
import quyumidu from '../../style/ztt/img/quyumidu.png';
import zaixianshebei from '../../style/ztt/img/zaixianshebei.png';
import fwnleiruwang from '../../style/ztt/img/fwnleiruwang.png';
import zuijinqingkuang from '../../style/ztt/img/zuijinqingkuang.png';
import yueruwangshu from '../../style/ztt/img/yueruwangshu.png';
class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state={
            weiHu:"",
            qiYe:"",
            baoJingNumber:"",
            geren:"",
            list:[],
            timeX:[],
            lineY:[],
            mapJson:[],
            recentSituation:[],
            raspberryTotal:[],
            LAN:[],
            alarmNumber:[],
            falseNumber:[],
            equipmentcount:1,
            equipmentEtotal:1
        }
    }
    componentDidMount() {
        this.adminPages();
    }
    //管理员首页
    adminPages = ()=>{
        post({url:"/api/company/getone_aky"},(res)=>{
            if(res.success){
                var a=res.data.companyadd.map(list =>list.name);
                for(let i=a.length-1;i>=0;i--){
                    var dayd=moment(a[i]).format('MM.DD');
                    this.state.timeX.push(dayd);
                }
               var timeY=res.data.companyadd.map(list =>list.value).reverse();
                if(res.success){
                    this.setState({
                        weiHu:res.data.maintain, //维护团队数
                        qiYe:res.data.smpqy, //企业用户数
                        geRen:res.data.smpgr, //个人用户数
                        baoJingNumber:res.data.alarmcount, //报警总数
                        mapJson:res.data.company,//地图坐标
                        lineY:timeY,//月入网数的y轴
                        raspberryTotal:res.data.smpqy+res.data.smpgr,//树莓派总数
                        LAN:res.data.jwy,//局域网
                        alarmNumber:res.data.alarmcount,//报警总数
                        falseNumber:res.data.afalse,//虚报数
                        recentSituation:res.data.alarm,//最近情况
                        equipmentEtotal:res.data.ecount, //在线设备数
                        equipmentcount:res.data.etotal //入网设备数
                    })
                }
            }
        });
    }
    classStyle = (index)=>{
        if(index===1){
            return "camera situationFont1";
        }else if(index===2){
            return "camera situationFont2";
        }else if(index===3){
            return "camera situationFont3";
        }else if(index===4){
            return "camera situationFont4";
        }else if(index===5){
            return "camera situationFont4";
        }
        
    }
    render() {
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom />
                <Row>
                    <Col xl={12} xxl={10}>
                      <Row>
                          <Col xl={11} xxl={11}>
                              <div className="gutter-box admin weiHuBorder">
                                  <Card>
                                      <div className="clear y-center">
                                          <Col xl={10} lg={8}>
                                             <div className="noBorder weiHuBackround">
                                                 <img src={weihutuandui} />
                                             </div>
                                          </Col>
                                          <Col xl={10} lg={5} offset={1}>
                                              <Row>
                                                  <Col xl={24} className="adminFont wiHuFont">{this.state.weiHu}</Col>
                                              </Row>
                                              <Row>
                                                  <Col xl={24}>维护团队</Col>
                                              </Row>
                                          </Col>
                                      </div>
                                  </Card>
                              </div>
                          </Col>
                          <Col xl={11} xxl={11} className="rightShift">
                              <div className="gutter-box admin qiYe">
                                  <Card>
                                      <div className="clear y-center">
                                          <Col xl={10} lg={8}>
                                              <img src={house} alt="" className="noBorder qiYeBackground" />
                                          </Col>
                                          <Col xl={10} lg={5} offset={1}>
                                              <Row>
                                                  <Col xl={24} className="qiYeFont adminFont">{this.state.qiYe}</Col>
                                              </Row>
                                              <Row>
                                                  <Col xl={24}>企业用户</Col>
                                              </Row>
                                          </Col>
                                      </div>
                                  </Card>
                              </div>
                          </Col>
                      </Row>
                        <Row>
                            <Col xl={11} xxl={11} className="topShift">
                                <div className="gutter-box admin baoJing">
                                    <Card>
                                        <div className="clear y-center">
                                            <Col xl={10} lg={8}>
                                                <img src={baojing} alt="" className="noBorder baoJingBackground" />
                                            </Col>
                                            <Col xl={10} lg={5} offset={1}>
                                                <Row>
                                                    <Col xl={24} className="baoJingFont adminFont">{this.state.baoJingNumber}</Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={24}>报警数</Col>
                                                </Row>
                                            </Col>
                                        </div>
                                    </Card>
                                </div>
                            </Col>
                            <Col xl={11} xxl={11} className="rightShift topShift">
                                <div className="gutter-box admin personalUser">
                                    <Card>
                                        <div className="clear y-center">
                                            <Col xl={10} lg={8}>
                                                <img src={users} alt="" className="noBorder personalUserBackground" />
                                            </Col>
                                            <Col xl={10} lg={5} offset={1}>
                                                <Row>
                                                    <Col xl={24} className="personalUseFont adminFont">{this.state.geRen}</Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={24}>个人用户</Col>
                                                </Row>
                                            </Col>
                                        </div>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                      <Row>
                        <Col xl={24} xxl={23} className="topShift">
                            <div className="gutter-box adminEchart">
                                <Card>
                                    <Row>
                                        <Col xl={1} xxl={1}><div className="sandian"><img src={quyumidu} alt="" /></div></Col>
                                        <Col xl={10} xxl={12}><span className="titleFont">维护团队区域密度图</span></Col>
                                    </Row>
                                    <EchartsProjects datasMap={this.state.mapJson}/>
                                </Card>
                            </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={12} xxl={10}>
                        <Row>
                            <Col xl={12} xxl={12}>
                                <div className="gutter-box adminEchart">
                                    <Card>
                                        <Row>
                                            <Col xl={3} xxl={2}><div className="sandian"><img src={baojingIcon} alt="" /></div></Col>
                                            <Col xl={10} xxl={12}><span className="titleFont">报警统计</span></Col>
                                        </Row>
                                        <Calpolice falseNumber={this.state.falseNumber} alarmNumber={this.state.alarmNumber}/>
                                        <div style={{width:"100%",textAlign:"center"}}><span>虚报数:{this.state.falseNumber}</span>&nbsp;&nbsp;&nbsp;
                                        <span>报警总数:{this.state.alarmNumber}</span></div>
                                    </Card>
                                </div>
                            </Col>
                            <Col xl={11} xxl={11} className="rightShift">
                                <div className="gutter-box adminEchart">
                                    <Card>
                                        <Row>
                                            <Col xl={3} xxl={2}><div className="sandian"><img src={zaixianshebei} alt="" /></div></Col>
                                            <Col xl={10} xxl={12}><span className="titleFont">在线设备</span></Col>
                                        </Row>
                                        <Onlineeq equipmentEtotal={this.state.equipmentEtotal} equipmentcount={this.state.equipmentcount}/>
                                        <div style={{width:"100%",textAlign:"center"}}><span>在线设备数:{this.state.equipmentEtotal}</span>&nbsp;&nbsp;&nbsp;
                                        <span>入网设备数:{this.state.equipmentcount}</span></div>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12} xxl={12} className="topShift">
                                <div className="gutter-box">
                                    <Card>
                                        <Row>
                                            <Col xl={3} xxl={2}><div className="sandian"><img src={fwnleiruwang} alt="" /></div></Col>
                                            <Col xl={10} xxl={12}><span className="titleFont">分类入网数</span></Col>
                                        </Row>
                                        <Classifiedaccess raspberry={this.state.raspberryTotal} classifiedLAN={this.state.LAN}/>
                                    </Card>
                                </div>
                            </Col>
                            <Col xl={11} xxl={11} className="rightShift topShift">
                                <div className="gutter-box">
                                    <Card>
                                        <Row>
                                            <Col xl={4} xxl={2}><div className="sandian"><img src={zuijinqingkuang} alt="" /></div></Col>
                                            <Col xl={10} xxl={12}><span className="titleFont">最近情况</span></Col>
                                        </Row>
                                        {
                                            this.state.recentSituation.map((item,index)=>{
                                                return(
                                                    <Row className="situation" key={index}>
                                                        <Col xl={2} xxl={2}><div className={this.classStyle(index+1)}>{index+1}</div></Col>
                                                        <Col xl={20} xxl={20} offset={1} className="listContext" title={item.name+"入侵报警"+item.atime}>{item.name }&nbsp;入侵报警&nbsp;{ item.atime}</Col>
                                                    </Row>
                                                )
                                            })
                                        }

                                    </Card>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={24} xxl={24} className="topShift adminYueRu">
                                <div className="gutter-box">
                                    <Card>
                                        <Row>
                                            <Col xl={2} xxl={1}><div className="sandian"><img src={yueruwangshu} alt="" /></div></Col>
                                            <Col xl={10} xxl={12}><span className="titleFont">月入网数</span></Col>
                                        </Row>
                                        <EchartsViews line={this.state.lineY}  times={this.state.timeX}/>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;



