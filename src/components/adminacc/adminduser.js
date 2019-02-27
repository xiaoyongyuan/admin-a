
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Form,Table, DatePicker,Input, Row, Col, Button,LocaleProvider} from 'antd';
import BreadcrumbCustom from "../BreadcrumbCustom";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
class AdmindUser extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            value: 1,
            page:1, //当前页
        };
    }
    componentDidMount() {
        this.requestdata()
    }
    requestdata=(params) => { //取数据
        this.props.form.validateFields((err, values) => {
        const pageset={
            pagesize:10,
            pageindex:this.state.page,
            bdate:this.state.bdate?this.state.bdate.format('YYYY-MM-DD'):'',
            edate:this.state.edate?this.state.edate.format('YYYY-MM-DD'):'',
            cname:values.name,
            pname:values.cteam, 
        }
        post({url:"/api/company/getlist_user",data:pageset}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                })
            }
        })
    })
    }

    
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
onChangeDate = (field, value) => {
    this.setState({
        [field]: value,
    });
};
    selectopt = (e) => { //检索search
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    page:1,
                },()=>{
                    this.requestdata()
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
                            
                            <FormItem label="云服务到期日期">
                                   {getFieldDecorator('range_picker1')(
                                       <DatePicker
                                           className="allInput"
                                           showTime={{format:"HH"}}
                                           format="YYYY-MM-DD"
                                           placeholder="开始时间"
                                           setFieldsValue={this.state.bdate}
                                           onChange={this.onChange1}
                                           disabledDate={this.disabledStartDate}
                                           onOpenChange={this.handleStartOpenChange}
                                       />
                                   )}
                               </FormItem>
                               <FormItem>
                                   {getFieldDecorator('range_picker2')(
                                       <DatePicker
                                           showTime={{format:"HH"}}
                                           format="YYYY-MM-DD"
                                           placeholder="结束时间"
                                           setFieldsValue={this.state.edate}
                                           onChange={this.onChange2}
                                           disabledDate={this.disabledEndDate}
                                           onOpenChange={this.handleEndOpenChange}
                                           className="allInput"
                                       />
                                   )}
                               </FormItem>
                          
                            {/* <FormItem label="云服务到期日期">
                                {getFieldDecorator('clouddata', {
                                    rules: [{ required: false, message: '请选择日期!' }],
                                })(
                                    <RangePicker onChange={onChange_time} format={dateFormat} />
                                )}
                            </FormItem> */}
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </FormItem>
                        </Form>
                        </LocaleProvider>
                    </Col>
                </Row>
                
                <Table 
                     columns={columns} dataSource={this.state.list} bordered={true}
                     pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                />
                </div>
            </div>

        )
    }

}

export default AdmindUser=Form.create()(AdmindUser);