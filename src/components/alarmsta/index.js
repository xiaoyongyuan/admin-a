import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Table, Row, Col, Form, Input, Button ,LocaleProvider ,message,Spin} from 'antd';
import '../../style/yal/home.css';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
const FormItem = Form.Item;

class Alarmsta extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            createinfo:[],
            page:1,
            cname:'',
            loading:true
        };
    }
    componentDidMount() {
        const params={
            pagesize:10,
            cname:this.state.cname,
            pageindex:this.state.page,

        };
        post({url:"/api/alarm/getlist_report",data:params}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                    loading:false
                })

            }
        })
    }
    changePage=(page)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
            loading:true
        },()=>{
            this.componentDidMount()
        })
    };
    showModalEdit=(code,index,record,ecode)=>{ //打开弹层
        this.setState({
            visible: true,
            type:code,
            ecode:ecode,
            index:index,
        });

    };


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
        post({url:"/api/equipment/e_upgrade",data:params}, (res)=>{
            if(res.success){
                message.success('升级成功')
            }
        })
    }
    handleCancel = (e) => {//关闭弹出层
        this.setState({
            visible: false,
        });
    };
    e_getinfo = (e) => {//更新数据
        const params = {
            ecode:this.state.ecode
        }
        return;
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
                    cname:values.cname,
                    page:1,
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
            },
            {   
                title:'所属公司',
                dataIndex:'cname',
                key:'cname'
            },
            {   
                title:'报警日期',
                dataIndex:'adate',
                key:'adate'
            },
            {   
                title:'报警总数',
                dataIndex:'alarmcount',
                key:'alarmcount'
            },
            {   
                title:'二次确认报警数',
                dataIndex:'confirmcount',
                key:'confirmcount'
            },
            {   
                title:'报警确认百分比（%）',
                dataIndex:'',
                key:'sure',
                render: (text, record,index) => {
                let bili = (record.confirmcount/record.alarmcount)*100;
                    return(
                        <div>
                            {bili.toFixed(0)}
                        </div>
                    )
                }
            }
            ];


        return (
            <LocaleProvider locale={zh_CN}>
                <div className="Alarmsta">
                        <BreadcrumbCustom first="报警统计" />
                        <div className="shange">
                            <Row>
                                <Col span={14}>
                                    <Form layout="inline" onSubmit={this.selectopt}>
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

                            <Row style={{marginTop:"20px"}}>
                                <Spin size="large" spinning={this.state.loading} tip="加载中......">
                                    <Table
                                        bordered={true}
                                        dataSource={this.state.list}
                                        onRow={this.onRowSelect}
                                        columns={columns}
                                        pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                                        rowKey={record =>record.companycode}
                                    />
                                </Spin>
                            </Row>

                        </div>
                    </div>
            </LocaleProvider>
        )
    }
}

export default Alarmsta= Form.create({})(Alarmsta);