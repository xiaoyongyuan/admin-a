import React, { Component, propTypes } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import ModalForm from './ModalForm';
import {Form,Input, Row, Col, Button , Modal,Icon ,DatePicker} from 'antd';
import '../../style/sjg/home.css';
import nodata from '../../style/imgs/nodata.png';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
const {RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
function onChange(date, dateString) {
    console.log(date, dateString);
}
function onChange_time(date, dateString) {
    console.log(date,dateString[0]);
}
class Adminteam extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            createinfo:[]
        };
    }
    state = {
        selectedRowKeys: [], 
        style:{
            backgroundColor:'#313653'
        },
        bordercol:{
            borderColor:'#313653'
        },
        visible: false,

    };

    componentDidMount() {
        const color=localStorage.getItem('@primary-color') || '#313653';
        this.setState({
            titstyle:{
                backgroundColor:color
            },
            bordercol:{
                borderColor:color
            }
        })
        this.requestdata()
    }
    requestdata=() => {//取数据
        post({url:"/api/company/getlist_aky"},(res)=>{
            if(res.success){
                this.setState({
                    list: res.data
                })
            }
        })
    }

    showModal = () => {  //新增弹窗
        this.setState({
            visible: true,
            type:0,
        });
    };
    showModalEdit= (code,index) => {  //编辑弹窗
        this.setState({
            visible: true,
            type:code,
            index:index
        });
    };
    handleCreate = (e) => {//modal提交
        e.preventDefault();
        const forms=this.formRef.formref();
        forms.validateFields((err, values) => {
            if (!err) {
                if(this.state.type){
                    //修改
                    let code={
                        comid:this.state.type,
                        cname:values.title,
                        clng:values.clng,
                        clat:values.clat,
                        adminname:values.linkname,
                        adminaccount:values.tel
                    };
                    post({url:"/api/company/update",data:code},(res)=>{
                        if(res.success){
                            let list=this.state.list;
                            list[this.state.index]=res.data[0];
                            this.setState({
                                list
                            })
                        }
                    })
                }else{
                    //新增
                    var data={
                        cname:values.title,
                        clng:values.clng,
                        clat:values.clng,
                        adminname:values.linkname,
                        adminaccount:values.tel,
                        ctype:2,
                    };
                    post({url:"/api/company/add",data:data},(res)=>{
                        if(res.success){
                            const list=this.state.list;
                            list.unshift(data);
                            this.setState({list})
                        }
                    })
                }
                this.setState({
                    visible: false,
                });
            }
        });
    };
    handleCancel = (e) => {  //modal取消
       const forms=this.formRef.formref();
       forms.resetFields();
        e.preventDefault();
        this.setState({
            visible: false,
        });
    };
    handleBtnChange = (e)=>{
        let params={
            cname:e.target.value,
        };
        post({url:"/api/company/getlist",data:params},(res)=>{
            if(res.success){
                this.setState({
                    list:res.data
                })
            }
        })
    }
    showModaldelete = (code) =>{  //删除弹层
        this.setState({
            deleteshow: true,
            type:code
        });
    }

    deleteOk = () =>{//删除确认
        let code={
            comid:this.state.type,
            ifdel:1
        };
        post({url:"/api/company/update",data:code},(res)=>{
            if(res.success){
                const list=this.state.list;
                list.splice(this.state.index,1);
                this.setState({
                    deleteshow: false,
                    list
                });
            }
        })
    };
    deleteCancel = () =>{//删除取消
        this.setState({
            deleteshow: false,
        });
    };
    render() {
        const {titstyle,bordercol }=this.state;
        const _this=this;
        const { form } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <BreadcrumbCustom first="功能扩展" second="管理员首页" />
                <div className="shange">
                    <Row>
                        <Col xl={9} xxl={6}>
                            <div className="example">
                                <Col xl={4} xxl={3}>查找：</Col><Col xl={8} xxl={3}><Input type="text" placeholder="请搜索团队名称" onChange={this.handleBtnChange} /></Col>
                            </div>
                        </Col>
                        <Col xl={4} xxl={4}>
                            <Button type="primary" onClick={this.showModal}>新增</Button>
                        </Col>

                    </Row>
                    <Row>
                        {
                            this.state.list.length
                            ?this.state.list.map(function(item,index) {
                            return(
                                <Col span={10} className="t_t" key={index}>
                                    <div className="team_item" style={bordercol}>
                                        <Row className="tit" style={titstyle}>
                                            <Col span={22}>
                                                <span>{item.cname}</span>
                                            </Col>
                                            <Col span={1} className="del">
                                                <Icon className="del_con" onClick={_this.showModalEdit.bind(item,item.code,index)} type="edit" />
                                            </Col>
                                            <Col span={1} className="del">
                                                <Icon className="del_con" type="delete" onClick={()=>_this.showModaldelete(item.code)}/>
                                            </Col>
                                        </Row>
                                        <Row className="item_f">
                                            <Col span={8}>
                                                树莓派个人用户数：{item.smpgr}
                                            </Col>
                                            <Col span={8}>
                                                树莓派企业用户数：{item.smpqy}
                                            </Col>
                                            <Col span={8}>
                                                局域网用户数：{item.jyw}
                                            </Col>
                                            <Col span={8}>
                                                使用中的设备数目：{item.ecount}
                                            </Col>
                                        </Row>
                                        <Row className="item_s">
                                            <Col span={8}>
                                                经度：{item.clng}
                                            </Col>
                                            <Col span={16}>
                                                纬度：{item.clat}
                                            </Col>
                                            <Col span={8}>
                                                联系人：{item.adminname}
                                            </Col>
                                            <Col span={16}>
                                                联系电话：{item.adminaccount}
                                            </Col>
                                        </Row>

                                    </div>

                                </Col>

                            )
                        })
                        : 
                            <Col offset={10} span={4}>
                                <p style={{marginTop:"150px"}}></p>
                                <img src={nodata}  width="200px"/>
                                <p style={{marginTop:"150px"}}></p>
                            </Col>
                         
                        }
                    </Row>
                </div>
                <Modal title={this.state.type?'编辑维护团队':'新增维护团队'} visible={this.state.visible} onOk={this.handleCreate}
          onCancel={this.handleCancel}>
                    <ModalForm visible={this.state.visible} code={this.state.type}  wrappedComponentRef={(form) => this.formRef = form} />
                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                       onCancel={this.deleteCancel}>
                    <p>确认删除吗？</p>
                </Modal>
            </div>
        )
    }
}

export default Adminteam=Form.create()(Adminteam);