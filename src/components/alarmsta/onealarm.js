

import React from 'react';
import { DatePicker, Row, Col, Select, Button, Modal, Pagination, Form, message,LocaleProvider,Spin } from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
import Alarmdetails from "./Alarmdetails";
import nodata from "../../style/imgs/nodata.png";
// import "../../style/ztt/img/plioce/iconfont.css";
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        xxl:{ span: 6}
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
class OneAlarm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            type:[],
            visible: false,
            alarm:false,
            policeList:[],
            equipment:[],
            equipment1:[],
            alermType:[],
            loadding:true,
            alarmImgType:false,
            bdate:'',//检索的开始时间
            edate:'',//检索的结束时间
            cid:"", //检索选中的设备
            endOpen: false,
            page:1, //当前页数
            pageSize:18, //每页显示数量
            totalcount:0, //数据总量
            toson:{}, //传给详情页面的值
            loading:1,
            displaygreen: 'block',
            displayred:'block',
            displayblue:'block',
            backColor:'',//背景颜色
            nodatapic:true,
        };
    }
    componentWillMount() {
        const activecompcode=localStorage.getItem('activecompcode');
        this.setState({
            activecompcode:activecompcode && activecompcode !='undefined'?activecompcode:''
        })
        if(this.props.query.id){
            this.setState({
                propsid:this.props.query.id,
            })
        }   
    }
    componentDidMount() {
        const data={};
        if(this.state.propsid){
            data.cid=this.state.propsid;
            data.status=0
        }
        this.handleEquipment();//设备select
        this.handleAlerm(data);//报警信息列表
    }
    handleCancelAlarmImg =()=>{
        this.setState({
            alarmImgType:false
        })
    };
    //一键处理
    handleProcessing = ()=>{
        this.setState({
            alarm:true
        });
    };
    handleCamera = ()=>{
        this.setState({
            visible: true,
        });
    };
    //摄像头
    handleOk = () => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    //查看报警详情
    alarmImg =(code)=>{
        const toson={
            code:code,
            bdate:this.state.bdate.locale?this.state.bdate.format('YYYY-MM-DD HH:00:00'):'',
            edate:this.state.edate.locale?this.state.edate.format('YYYY-MM-DD HH:00:00'):'',
            cid:this.state.cid,
        };
        this.setState({
            alarmImgType:true,
            toson:toson
        })
    }
    hanlePageSize = (page) => { //翻页
        const data={};
        if(this.state.propsid){
            data.cid=this.state.propsid
            data.status=0
        }
        data.bdate=this.state.bdate?this.state.bdate.format('YYYY-MM-DD HH:00:00'):'';
        data.edate=this.state.edate?this.state.edate.format('YYYY-MM-DD HH:00:00'):'';
        data.cid=this.state.cid;
        this.setState({
            page:page
        },()=>{
            this.handleAlerm(data)
        })
    };
    //报警信息列表
    handleAlerm = (data={})=>{
        
        post({url:'/api/alarm/getlist',data:Object.assign(data,{pageindex:this.state.page,pagesize:18,passivecode:this.state.activecompcode})},(res)=>{
            if(res.success){
                this.setState({
                    displaysearch:true,
                })
                if(res.data.length===0){
                    this.setState({
                      nodatapic:false,
                  })
              }
                if(res.data.length){
                    this.setState({
                        policeList:res.data,
                        type:1,
                        totalcount:res.totalcount,
                        loadding:false
                    })
                }else{
                    this.setState({
                        type:0,
                        loadding:false
                    })
                }
            }else{
                this.setState({
                    loadding:false,
                    type:0,
                })
            }
        })
    };
    //设备select
    handleEquipment = ()=>{
        post({url:"/api/camera/get_cameralist"},(res)=>{
            if(res.success){
                this.setState({
                    equipment:res.data,
                })
            }
        })
    };
    /*
    * 检索
    * 开始时间、结束时间、设备cid
    * */
    handleSubmit =(e)=>{
        this.setState({
            displaysearch:false,
        })
        e.preventDefault();
        if(this.state.propsid){
            this.setState({
                    propsid:'',
                })
        }
        this.setState({
                    page:1,
                    loadding:true,
                },()=>{
                    const data={
                        bdate:this.state.bdate?this.state.bdate.format('YYYY-MM-DD HH:00:00'):'',
                        edate:this.state.edate?this.state.edate.format('YYYY-MM-DD HH:00:00'):'',
                        cid:this.state.cid
                    };
                    this.handleAlerm(data);
                })
        
    };

    //搜索设备选中的值
    handleChange =(value)=>{
        this.setState({
            cid:value
        })
    };
  
    onChangeDate = (field, value) => {
        this.setState({
            [field]: value,
        });
    };
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    };
    //禁止的开始时间
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };
    //禁止的结束时间
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };
    //开始时间
    onChange1 =(dateString1)=> {
        this.onChangeDate('startValue',dateString1);
        this.setState({
            bdate:dateString1
        })
    };
    //结束时间
    onChange2 =(dateString2)=> {
        this.onChangeDate("endValue",dateString2);
        this.setState({
            edate:dateString2
        })
    };

 

    redgreenblue = (status)=>{
        if(status === 0){
            return("typeOrange");
        }else if(status === 1){
            return("typegreen");
        }else if(status === 2){
            return("typeblue");
        }else if(status === 3){
            return("typered");
        }
    };
    //报警状态
    handleState = (code)=>{
        if(code === 0){
            return "未处理";
        }else if(code === 1){
            return "确认";
        }else if(code === 2){
            return "忽略";
        }else if(code === 3){
            return "虚警";
        }
    };
    sanjiaose = (status)=>{
        if(status === 0){
            return("triangle-topright-green triangleOrange");
        }else if(status === 1){
            return("triangle-topright-green trianglegreen");
        }else if(status === 2){
            return("triangle-topright-green triangleblue");
        }else if(status === 3){
            return("triangle-topright-green trianglered");
        }
    }
    changeredgreenblue =(type,index,code)=>{
        if(this.state.activecompcode) return;
        post({url:'/api/alarm/update',data:{code:code,status:type}},(res)=>{
            if(res.success){
                const policeList=this.state.policeList;
                policeList[index].status=type;
                this.setState({
                    policeList:policeList
                })
            }
        });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="OneAlarm Alarmlist">
                <LocaleProvider locale={zh_CN}>
                    <Row style={{marginTop:"20px"}}>
                        <Form onSubmit={this.handleSubmit}>
                            <Col xl={6} xxl={5} lg={10}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="日期"
                                >
                                    {getFieldDecorator('range-picker1')(
                                        <DatePicker
                                            className="allInput"
                                            showTime={{format:"HH"}}
                                            format="YYYY-MM-DD HH:00:00"
                                            placeholder="开始时间"
                                            setFieldsValue={this.state.bdate}
                                            onChange={this.onChange1}
                                            disabledDate={this.disabledStartDate}
                                            onOpenChange={this.handleStartOpenChange}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={5} xxl={4} lg={10}>
                                <Form.Item>
                                    {getFieldDecorator('range-picker2')(
                                        <DatePicker
                                            showTime={{format:"HH"}}
                                            format="YYYY-MM-DD HH:00:00"
                                            placeholder="结束时间"
                                            setFieldsValue={this.state.edate}
                                            onChange={this.onChange2}
                                            disabledDate={this.disabledEndDate}
                                            onOpenChange={this.handleEndOpenChange}
                                            className="allInput"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={4} xxl={3} lg={8}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="设备"
                                >
                                    {getFieldDecorator('residence',{
                                        initialValue:""
                                    } )(
                                        <Select style={{ width: 120 }} onChange={this.handleChange}>
                                            <Option value="" >所有</Option>
                                            {
                                                this.state.equipment.map((v,i)=>(
                                                    <Option value={v.code} key={i}>{v.name}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={2} xxl={2} lg={6} className="mt">
                                <Button type="primary" htmlType="submit" className="queryBtn">查询</Button>
                            </Col>
                           
                        </Form>
                    </Row>
                </LocaleProvider>
                <Spin size="large" spinning={this.state.loadding} tip="Loading..." className="loadding" />
                {/* {this.state.nodatapic?"":
                <Row style={{marginTop:"70px",}}>
                     <Col style={{width:"100%",textAlign:"center"}}><div className="backImg"><img src={nodata} alt="" /></div></Col>
                </Row>} */}
{/*                 
                <Row style={{marginLeft:"10px",display:this.state.type===0?"none":"block",}}>
                    {
                        this.state.policeList.map((v,i)=>(
                            <Col xm={11} sm={11} md={11} lg={11} xl={11} xxl={7} key={i} style={{margin:"0px 10px",display:this.state.displaysearch=== true?" block":"none"}}>
                                <div className="listmargintop">
                                    <div className={this.redgreenblue(v.status)} >
                                        <Row>
                                            <Col span={8}>
                                                <div className="pliceImgyal" onClick={()=>this.alarmImg(v.code)}>
                                                    <img src={v.pic_min} alt="" />
                                                </div>
                                            </Col>
                                            <Col span={16} className="r_flex">
                                                <Row className="row-alarmlist-detail">
                                                    <Col span={20}>
                                                        <Row className="word-row">
                                                            <Col span={18}>
                                                                <Row>
                                                                    <Col span={14} style={{marginLeft:'5px'}} push={1}>
                                                                        <p className="fontstyle">{v.name}</p>
                                                                    </Col>
                                                                    <Col span={9} push={4} style={{textAlign:'right' }}>
                                                                        <p className="fontstyle time-col">{v.atype===1?"入侵检测":""}</p>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className="word-row">
                                                            <Col span={13} push={1}>
                                                                <p className="time-col fontstyle fontstyletime">{v.atime}</p>
                                                            </Col>
                                                            <Col span={9} push={1} style={{marginLeft:'13px'}}>
                                                                <p className="fontstyle time-col">报警对象：{v.tags===""?"无":v.tags}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
               */}
              {/* //修改 */}
               <Row style={{marginLeft:"10px"}}>
                            <Col xm={11} sm={11} md={11} lg={11} xl={11} xxl={7} style={{margin:"0px 10px",display:this.state.displaysearch=== true?" block":"none"}}>
                                <div className="listmargintop">
                                    <div>
                                        <Row>
                                        <Col span={8}>
                                                <div className="pliceImgyal" onClick={()=>this.alarmImg()}>
                                                    <img src={nodata} alt="" />
                                                </div>
                                            </Col>
                                           
                                            <Col span={16} className="r_flex">
                                                <Row className="row-alarmlist-detail">
                                                    <Col span={20}>
                                                        <Row className="word-row">
                                                            <Col span={18}>
                                                                <Row>
                                                                    <Col span={14} style={{marginLeft:'5px'}} push={1}>
                                                                        <p className="fontstyle">yy</p>
                                                                    </Col>
                                                                    <Col span={9} push={4} style={{textAlign:'right' }}>
                                                                        <p className="fontstyle time-col">入侵检测</p>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className="word-row">
                                                            <Col span={13} push={1}>
                                                                <p className="time-col fontstyle fontstyletime">2019-01-19 11:15:59</p>
                                                            </Col>
                                                            <Col span={9} push={1} style={{marginLeft:'13px'}}>
                                                                <p className="fontstyle time-col">报警对象：人</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            <Col xm={11} sm={11} md={11} lg={11} xl={11} xxl={7} style={{margin:"0px 10px",display:this.state.displaysearch=== true?" block":"none"}}>
                                <div className="listmargintop">
                                    <div>
                                        <Row>
                                        <Col span={8}>
                                                <div className="pliceImgyal" onClick={()=>this.alarmImg()}>
                                                    <img src={nodata} alt="" />
                                                </div>
                                            </Col>
                                           
                                            <Col span={16} className="r_flex">
                                                <Row className="row-alarmlist-detail">
                                                    <Col span={20}>
                                                        <Row className="word-row">
                                                            <Col span={18}>
                                                                <Row>
                                                                    <Col span={14} style={{marginLeft:'5px'}} push={1}>
                                                                        <p className="fontstyle">yy</p>
                                                                    </Col>
                                                                    <Col span={9} push={4} style={{textAlign:'right' }}>
                                                                        <p className="fontstyle time-col">入侵检测</p>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className="word-row">
                                                            <Col span={13} push={1}>
                                                                <p className="time-col fontstyle fontstyletime">2019-01-19 11:15:59</p>
                                                            </Col>
                                                            <Col span={9} push={1} style={{marginLeft:'13px'}}>
                                                                <p className="fontstyle time-col">报警对象：人</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            <Col xm={11} sm={11} md={11} lg={11} xl={11} xxl={7} style={{margin:"0px 10px",display:this.state.displaysearch=== true?" block":"none"}}>
                                <div className="listmargintop">
                                    <div>
                                        <Row>
                                        <Col span={8}>
                                                <div className="pliceImgyal" onClick={()=>this.alarmImg()}>
                                                    <img src={nodata} alt="" />
                                                </div>
                                            </Col>
                                           
                                            <Col span={16} className="r_flex">
                                                <Row className="row-alarmlist-detail">
                                                    <Col span={20}>
                                                        <Row className="word-row">
                                                            <Col span={18}>
                                                                <Row>
                                                                    <Col span={14} style={{marginLeft:'5px'}} push={1}>
                                                                        <p className="fontstyle">yy</p>
                                                                    </Col>
                                                                    <Col span={9} push={4} style={{textAlign:'right' }}>
                                                                        <p className="fontstyle time-col">入侵检测</p>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className="word-row">
                                                            <Col span={13} push={1}>
                                                                <p className="time-col fontstyle fontstyletime">2019-01-19 11:15:59</p>
                                                            </Col>
                                                            <Col span={9} push={1} style={{marginLeft:'13px'}}>
                                                                <p className="fontstyle time-col">报警对象：人</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                   </Row>
                   
              {/* 修改结束 */}
                <Pagination defaultCurrent={this.state.page} current={this.state.page} total={this.state.totalcount} pageSize={this.state.pageSize} onChange={this.hanlePageSize} className="pageSize" style={{display:this.state.type===1?"block":"none"}} />
                <Modal
                    title="播放视频"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                />
                <Modal
                    title="报警批量处理"
                    visible={this.state.alarm}
                    onOk={this.handleOkalarm}
                    onCancel={this.handleCancelalarm}
                    okText="确认"
                    cancelText="取消"
                >
                    <div>
                        摄像头选择：
                        <Select defaultValue="请选择摄像头" style={{ width: 180 }} onChange={this.handleOnekey}>
                            {
                                this.state.equipment.map((v,i)=>(
                                    <Option value={v.code} key={i}>{v.name}</Option>
                                ))
                            }
                        </Select>

                    </div>
                </Modal>
                <div>
                    <Modal
                        width={1200}
                        title="报警详情"
                        visible={this.state.alarmImgType}
                        onCancel={this.handleCancelAlarmImg}
                        footer={null}
                    >
                        <Alarmdetails visible={this.state.alarmImgType} toson={this.state.toson} />
                    </Modal>
                </div>
            </div>
        )
    }
}

export default OneAlarm= Form.create()(OneAlarm);
