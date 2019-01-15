import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Table, Row, Col, Form, Input, Button ,Icon,Modal,message} from 'antd';
import '../../style/yal/home.css';
import moment from "moment";
import EquipDetail from './EquipDetail';

const FormItem = Form.Item;

class AdminEquipment extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            createinfo:[],
            page:1,
        };
    }
    componentDidMount() {
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
                    total:res.totalcount
                })
            }
        })
    }

    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
            ecode:'',
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
        },()=>{
            console.log('code,index,record',code,index,record)
        });

    }


    onRowSelect = (record, index)=>{//table 行单击
        return {
            onClick:(e)=>{
                console.log(record);
                this.showModalEdit(record.code,index,record,record.ecode)
            }
        }
    };

    e_upgrade = (e) =>{//设备升级
        console.log("设备升级");
        const params={
            ecode:this.state.ecode
        }
        // return;
        console.log("测试return");
        post({url:"/api/equipment/e_upgrade",data:params}, (res)=>{
            if(res.success){
                message.success('升级成功')
            }
        })
    }
    handleCancel = (e) => {//关闭弹出层
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    e_getinfo = (e) => {//更新数据
        console.log("更新数据");
        const params = {
            ecode:this.state.ecode
        }
        return;
        console.log("测试return");
        post({url:"/api/equipment/e_getinfo",data:params}, (res)=>{
            if(res.success){
                message.success('更新成功')
            }
        })


    };
    selectopt = (e) => { //检索search
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
    render() {
        const { getFieldDecorator } = this.props.form;
        const data = new Date().getTime();
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
                                ? <div>{record.ecode} <Icon type="clock-circle" title='已离线' /></div>
                                :record.ecode
                            }
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
                            text == "null"?"":text
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
            },{
            title:'所属公司',
                dataIndex:'cname',
                key:'cname'
            }
            ];


        return (
            <div className="AdminEquipment">
                <BreadcrumbCustom first="设备信息"/>
                <div className="shange">
                    <Row>
                        <Col span={14}>
                            <Form layout="inline" onSubmit={this.selectopt}>
                                <FormItem label="设备编号">
                                    {getFieldDecorator('ecode', {
                                        rules: [{
                                            required: false,
                                            message: '请输入设备编号!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label="公司名称">
                                    {getFieldDecorator('cname', {
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
                    <Row>
                        <Table
                            bordered={true}
                            dataSource={this.state.list}
                            onRow={this.onRowSelect}
                            columns={columns}
                            pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                        />
                    </Row>
                    <Modal visible={this.state.visible}
                           title='设备详细信息'
                           onCancel={this.handleCancel}
                           footer={[
                               <Button key="back" onClick={this.e_getinfo}>数据更新</Button>,
                               <Button key="submit" type="primary"  onClick={this.e_upgrade}>
                                   升级
                               </Button>,
                           ]}
                    >
                        <EquipDetail
                            visible={this.state.visible}
                                     code={this.state.type}
                            ecode={this.state.ecode}

                    />
                    </Modal>
                </div>
            </div>
        )
    }
}

export default AdminEquipment= Form.create({})(AdminEquipment);