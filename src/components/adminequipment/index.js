import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Table, Row, Col, Form, Input, Button } from 'antd';

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
                            columns={columns}
                            pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                        />
                    </Row>
                </div>
            </div>
        )
    }
}

export default AdminEquipment= Form.create({})(AdminEquipment);