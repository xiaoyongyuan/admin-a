import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Form,Table, DatePicker,Input, Row, Col, Button,LocaleProvider,Spin} from 'antd';
import BreadcrumbCustom from "../BreadcrumbCustom";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
const RangePicker = DatePicker.RangePicker;
var pageset={};
const FormItem = Form.Item;
class AdmindUser extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            value: 1,
            page:1, //当前页
            loading:true,
        };
    }
    componentDidMount() {
        this.requestdata();

        this.state={
            loading:true,
        };
    }
    requestdata=(params) => { //取数据
        this.setState({
            loading:true,
        })
        post({url:"/api/company/getlist_user",data:pageset}, (res)=>{
            if(res.success){
                this.setState({
                    loading:false,
                    list: res.data,
                    total:res.totalcount,
                })
            }
    })
    }
    selectopt = (e) => { //检索search
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
                pageset={
                    pagesize:10,
                    pageindex:this.state.page,
                    bdate:values.range_picker1&&values.range_picker1.length?values.range_picker1[0].format("YYYY-MM-DD"):"",
                    edate:values.range_picker1&&values.range_picker1.length?values.range_picker1[1].format("YYYY-MM-DD"):"",
                    cname:values.name,
                    pname:values.cteam, 
                }
                if(!err){
                    this.setState({
                        page:1,
                    },()=>{
                        this.requestdata(pageset)
                    })
                }
           
       })
    }
    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
        },()=>{
            this.requestdata()  
        })
    }
searchCancel = () =>{//删除取消
    this.setState({
        deleteshow: false,
    });
};
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
                title: '单位名称',
                dataIndex: 'cname',
                key: 'cname'
            },
            
            {
                title: '联系人',
                dataIndex: 'adminname',
                key: 'adminname',
            },
            {
                title: '联系人电话',
                dataIndex: 'adminaccount',
                key: 'adminaccount',
            },{
                title: '所属团队',
                dataIndex: 'pname',
                key: 'pname',
            },
            {
                title: '云服务到期日期',
                dataIndex: 'cloudvaliddate',
                key: 'cloudvaliddate',
            },
            {
                title: '类型',
                dataIndex: 'ctype',
                key: 'ctype',
                render: (text, record) => {
                 if(text===4){
                    return ('树莓派企业用户');
                 }if (text===5) {
                    return ('局域网企业用户');
                 } else {
                    return ('树莓派个人用户');
                 }
                },
            }];
        return (
            <LocaleProvider locale={zh_CN}>
            <div className="AdmindUser">
                <BreadcrumbCustom first="账号管理" second="用户管理" />
                <div className="shange">
                <Row style={{marginBottom:'20px'}}>
                    <Col span={18}>
                    <LocaleProvider locale={zh_CN}>
                        <Form layout="inline"onSubmit={this.selectopt}>
                            <FormItem label="单位名称">
                                {getFieldDecorator('name', {
                                    rules: [{ required: false, message: '请输入单位名称!' }],
                                })(
                                     <Input />
                                )}
                            </FormItem>
                            <FormItem label="所属团队">
                                {getFieldDecorator('cteam', {
                                    rules: [{ required: false, message: '请输入所属团队!' }],
                                })(
                                     <Input />
                                )}
                            </FormItem>
                            
                            <Form.Item
                                label="日期"
                            >
                                {getFieldDecorator('range_picker1')(
                                    <RangePicker placeholder={['开始时间', '结束时间']} />
                                )}
                            </Form.Item>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </FormItem>
                        </Form>
                        </LocaleProvider>
                    </Col>
                </Row>
                <Spin spinning={this.state.loading} size="large"tip="加载中..." >
                    <Table
                         columns={columns} dataSource={this.state.list} bordered={true}
                         pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage,hideOnSinglePage:true}}
                    />
                </Spin>
                </div>
                
            </div>
            </LocaleProvider>
        )
    }

}

export default AdmindUser=Form.create()(AdmindUser);