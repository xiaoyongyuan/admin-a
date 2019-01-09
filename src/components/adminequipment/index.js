import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Table, Row, Col, Form, Input, Button ,Icon,Modal} from 'antd';
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
        },()=>{
            this.componentDidMount()
        })

    }

    showModalEdit=(code,index,record)=>{ //打开弹层
        this.setState({
            visible: true,
            type:code,
            index:index,
        },()=>{
            console.log('code,index,record',code,index,record)
        });

    }
    handleCancel = (e) => {//关闭弹层
        // const forms=this.formRef.formref();
        this.setState({
            visible: false,
        });
        // forms.resetFields();
    };
    onRowSelect = (record, index)=>{//table 行单击
        return {
            onClick:(e)=>{
                console.log(123);
                console.log(record);
                this.showModalEdit(record.code,index,record)
            }
        }
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
                                ? <div>{record.ecode}<Icon type="close-square" /></div>
                                :record.ecode
                            }
                        </div>
                    )
                }
        }, {
            title: '最后一次心跳时间',
            dataIndex: 'lastheart',
            key: 'age',
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
                            dataSource={this.state.list}
                            onRow={this.onRowSelect}
                            columns={columns}
                            pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                        />
                    </Row>
                    <Modal visible={this.state.visible}
                           onOk={this.handleCreate}
                           title='设备详细信息'
                           okText="升级"
                           cancelText="取消"
                           onCancel={this.handleCancel}
                    >
                        <EquipDetail
                            visible={this.state.visible}
                                     code={this.state.type}

                    />
                    </Modal>
                </div>
            </div>
        )
    }
}

export default AdminEquipment= Form.create({})(AdminEquipment);