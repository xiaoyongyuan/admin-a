import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Table, Row, Col, Form, Input, Button ,Icon,Modal,message,Spin,Slider,LocaleProvider } from 'antd';
import '../../style/yal/home.css';
import moment from "moment";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import EquipDetail from './EquipDetail';
import Alarmnum from './Alarmnum';
const FormItem = Form.Item;
class AdminEquipment extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            block:false,
            threshold:false,//是否确认阈值弹框、
            leave:false,
            list:[],
            createinfo:[],
            page:1,
            toson:{}, //传给详情页面的值
            loading: true,//加载状态
            disabled: false,
            alarmImgType:false,
        };
    }
    componentDidMount() {
        this.getlist();
     
    }
    getlist=()=>{
        const params={
            pagesize:10,
            ecode:this.state.ecode,
            cname:this.state.cname,
            pageindex:this.state.page,
            estatus:1,

        }
        post({url:"/api/equipment/getlistforadmin",data:params}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                    loading: false,//加载状态
                
                })
            }
        })
    }
    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
            ecode:'',
            loading:true
        },()=>{
            this.componentDidMount()
        })

    }
    showModalEdit=(code,index,record,ecode)=>{ //打开弹层
        this.setState({
            visible: true,
            type:code,
            ecode:ecode,
            index:index,
        });
    }
    onRowSelect = (record, index)=>{//table 行单击
        return {
            onClick:(e)=>{
                this.showModalEdit(record.code,index,record,record.ecode)
            }
        }
    };
    e_upgrade = (e) =>{//设备升级
        const params={
            ecode:this.state.ecode
        }
        // return;
        post({url:"/api/equipment/e_upgrade",data:params}, (res)=>{
            if(res.success){
                message.success('设备正在升级中，请稍后...')
            }
        })
    }
    handleCancel = (e) => {//关闭弹出层
        this.setState({
            visible: false,
            block: false,
            leave: false,
        });
    };


    e_getinfo = (e) => {//更新数据
        const params = {
            ecode:this.state.ecode
        };
   console.log('this.state.ecode',this.state.ecode);
   
        post({url:"/api/equipment/e_getinfo",data:params}, (res)=>{
            if(res.success){
                message.success('更新成功')
            }
        })
    };
    selectopt = (e) => { //检索search
        this.setState({
            loading:true
        });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    ecode: values.ecode,
                    cname:values.cname,
                    page:1
                },()=>{
                    this.componentDidMount()
                })
            }
        })
    }
    
    viewdetails = (text,record) =>{ //查看设备信息
        this.showModalEdit(record.code);
        this.setState({
            ecode:record.ecode,
        })
    }
    canequip = (text,record) =>{ 
        //获取设备信息接口
        var _this=this;
        this.setState({
            coded:record.code,
            loading: true,//加载状态
        })
        post({url:"/api/equipment/get_equipmentinfo",data:{cid:record.cid,eid:record.ecode}}, (res)=>{
            this.setState({
                adta:res.data
            })
            if(res.success){
                //获取异步任务列表
                // const _this=this;
                let inter=setInterval(function(){
                    post({url:"/api/smptaskresult/getone",data:{code:_this.state.adta}}, (res)=>{
                        if(moment()-moment(res.data.createon)>10000){ //点名10秒无结果
                            _this.setState({
                                loading: false,//加载状态
                            });
                            message.warn('请求超时，请稍后再试');
                            clearInterval(inter);
                        }
                        if(res.success){
                            if(res.data.taskstatus){
                                _this.setState({
                                    loading: false,//加载状态
                                    block:true,
                                    cidA:res.data.cid,
                                    codeA:res.data.code,
                                    companycodeA: res.data.companycode,
                                    createonA: res.data.createon,
                                    eidA:res.data.eid,
                                    memoA:res.data.memo,
                                    rediskeyA:res.data.rediskey,
                                    taskmemoA: res.data.taskmemo,
                                    taskresultA:res.data.taskresult,
                                    taskstatusA: res.data.taskstatus,
                                    tasktimeA:res.data.tasktime,
                                    });
                                    clearInterval(inter);
                                }
                            }
                    })
                },2000)
            }
        })
    };

    //查看报警详情
    alarmImg =(text,record,index)=>{
            var toson={
                ccode:record.ccode,
                cid:record.cid,
                eid:record.ecode,
            };
        this.setState({
            alarmImgType:true,
            toson:toson
        })
    }
    handleCancelAlarmImg =()=>{
        this.setState({
            alarmImgType:false
        })
       this.getlist();
    };

    ifleavefactory = (text,record) => {//出厂设置弹出层
        this.setState({
            eid:record.ecode,
            leave: true,
        });
    };
    leaveCancel = (e) => {//恢复出厂设置确认
        post({url:"/api/equipment/restore_e",data:{eid:this.state.eid}}, (res)=>{
            if(res.success){
                message.success('修改成功');
            }
        })
        this.setState({
            leave: false,
        });
    };


    //阈值弹出层
    thresholdCancel= (e) => {//关闭阈值弹出层
        let list=this.state.list;
        list[this.state.index].threshold=this.state.onBeforevalue;
        this.setState({
            list:list,
            threshold:false,//是否确认阈值弹框、
        });
    };
    onBefore= (e,record) => {//阈值改变前onBeforeChange
        this.setState({
            onBeforevalue:e,//阈值改变前值
       })            
    };
    threshold = (value,index) => {//阈值改变 onChange
        let list=this.state.list;
        list[index].threshold=value;
        this.setState({
             list:list,
             index:index,
             threshold:true,//是否确认阈值弹框、
             successvalue:value,//阈值改变值
        })
      };
    remove = (record) => {//阈值改变 onAfterChange
        this.setState({
            threshold:record.threshold,//阈值改变后值
            code:record.code,
        })   
    };
    thresholdok = (e) => {//确认阈值按钮
        this.setState({
            threshold:false,//是否确认阈值弹框、
        });
        const params={
            threshold:this.state.threshold,
            code:this.state.code,
        }
        post({url:"/api/camera/update_threshold",data:params}, (res)=>{
            if(res.success){
                let list=this.state.list;
                list[this.state.index].threshold=this.state.successvalue;
                this.setState({
                    list:list,
               })
               message.success('修改成功');
            }
        })
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record,index) => (index+1)
            },{
            title: '设备编号',
            dataIndex: 'ecode',
            key: 'ecode',
           
                render: (text, record,index) =>{
                    return(
                        <div>
                            {moment().subtract('minutes',5).format('YYYY-MM-DD HH:mm:ss') > record.lastheart
                                ? <div>{record.ecode} <Icon type="clock-circle" title="已离线" /></div>
                                :record.ecode
                            }
                        </div>
                    )
                }
        }, {
            title: '阈值',
            dataIndex: 'threshold',
            key: 'threshold',
            width: 220,
            render:(text,record,index)=>{
                const { disabled } = this.state;
                return(
                    <div>
                        {<Slider 
                            style={{width:'76%',float:'left'}} 
                            onBeforeChange={(e)=>this.onBefore(e,record)}
                            onAfterChange={()=>this.remove(record)}
                            onChange={(value)=>this.threshold(value,index,record)}
                            min={1} 
                            max={9} 
                            defaultValue={record.threshold} 
                            disabled={disabled} 
                            value={record.threshold}
                         />
                        } 
                         <div className="rednum">
                             {record.threshold}
                         </div>
                    </div>
                )
            }
        }, {
            title: '最后一次心跳时间',
            dataIndex: 'lastheart',
            key: 'age',
                render:(text,record,index)=>{
                return(
                    <div>
                        {
                            text === "null"?"":text
                        }
                    </div>
                )
                }
            },
            {
                title: '最后一次报警时间',
                dataIndex: 'lastonce',
                key: 'lastonce',
            },
            {
                title:'最后二次报警时间',
                dataIndex:'lasttwice',
                key:'lasttwice',
            },
            {
                title:'所属单位',
                dataIndex:'cname',
                key:'cname',
                width: 120,
            },
            {
            title:'误报数量',
                dataIndex:'misinfocount',
                key:'misinfocount',
                width: 100,
                render: (text,record,index) => {
                    return(
                        <div onClick={()=>this.alarmImg(text,record,index)} className="wbsum">
                            {
                            <span >
                               {text}
                            </span>
                            }
                        </div>
                    )
                }
            },
            {
                title:'操作',
                    dataIndex:'data',
                    key:'data',
                    width:300,
                    render: (text, record) => {
                        return(
                            <div>
                                {
                                    <span style={{marginLeft:'10%'}}>
                                        <Button type="primary" onClick={()=>this.viewdetails(text,record)}>查看详情</Button>
                                        <Button type="primary" style={{marginLeft:'1%'}} onClick={()=>this.canequip(text,record)}>获取当前设备信息</Button>
                                        <Button type="primary" onClick={()=>this.ifleavefactory(text,record)} style={{marginLeft:'9%',marginTop:'10px'}}>恢复出厂设置</Button>
                                    </span>
                                }
                            </div>
                        )
                    }
                }
            ];
        return (
            <LocaleProvider locale={zh_CN}>
            <div className="AdminEquipment">
                <BreadcrumbCustom first="设备信息" />
                <div className="shange">
                    <Row>
                        <Col span={14}>
                            <Form layout="inline" onSubmit={this.selectopt}>
                                <FormItem label="设备编号">
                                    {getFieldDecorator("ecode", {
                                        rules: [{
                                            required: false,
                                            message: '请输入设备编号!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label="公司名称">
                                    {getFieldDecorator("cname", {
                                        rules: [{
                                            required: false,
                                            message: '请输入公司名称!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                    <Row style={{marginTop:"20px"}}>
                        <Spin spinning={this.state.loading} size="large" className="spin" tip="加载中...">
                            <Table
                                rowKey={record => record.code}
                                // eslint-disable-next-line react/jsx-boolean-value
                                bordered={true}
                                dataSource={this.state.list}
                                columns={columns}
                                pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage,hideOnSinglePage:true}}
                            />
                        </Spin>
                    </Row>
                    
                    <Modal visible={this.state.visible} width={550}
                           title="设备详细信息"
                           onCancel={this.handleCancel}
                           footer={[
                               <Button key="back" onClick={this.e_getinfo}>数据更新</Button>,
                               <Button key="submit" type="primary" onClick={this.e_upgrade}>
                                   升级
                               </Button>,
                           ]}
                    >
                        <EquipDetail style={{width:"660px",background:"green"}}
                            visible={this.state.visible}
                                     code={this.state.type}
                            ecode={this.state.ecode}

                        />
                    </Modal>
                    <Modal visible={this.state.block} width={550}
                           title="设备"
                           onCancel={this.handleCancel}
                           footer={[ <Button key="back" onClick={this.handleCancel} >确认</Button>]}
                    >
                            <div style={{marginLeft:"60px"}}>
                                <div>cid：<span> {this.state.cidA} </span></div>
                                <div>code：<span> {this.state.codeA}</span></div>
                                <div>companycode：<span> {this.state.companycodeA}</span></div>
                                <div>createon：<span> {this.state.createonA}</span></div>
                                <div>eid：<span> {this.state.eidA}</span></div>
                                <div>memo：<span> {this.state.memoA}</span></div>
                                <div>rediskey：<span> {this.state.rediskeyA}</span></div>
                                <div>taskmemo：<span> {this.state.taskmemo}</span></div>
                                <div>taskresult：<span> {this.state.taskresultA}</span></div>
                                <div>taskstatus：<span> {this.state.taskstatusA}</span></div>
                                <div>tasktime：<span> {this.state.tasktimeA}</span></div>
                            </div>
                    </Modal>
                    <Modal visible={this.state.threshold} width={400}
                           title="改变阈值"
                           okText="确认"
                           cancelText="取消"
                           onCancel={this.thresholdCancel}
                           onOk={this.thresholdok}
                    >
                            <div style={{marginLeft:"60px"}}>
                                是否确定改变阈值？
                            </div>
                    </Modal>

                    <Modal visible={this.state.leave} 
                           title="恢复出厂设置"
                           okText="确认"
                           cancelText="取消"
                           onCancel={this.handleCancel}
                           onOk={this.leaveCancel}
                          
                    >
                           <div>是否恢复出厂设置?</div>
                    </Modal>
                    <Modal
                        width={900}
                        title="误报详情"
                        visible={this.state.alarmImgType}
                        onCancel={this.handleCancelAlarmImg}
                        footer={null}
                    >
                        <Alarmnum visible={this.state.alarmImgType} toson={this.state.toson} />
                    </Modal>
                </div>
            </div>           
            </LocaleProvider>
          
        )
    }
}

export default AdminEquipment= Form.create({})(AdminEquipment);