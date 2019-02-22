
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Form,Table, DatePicker,Input, Row, Col, Button,Modal,LocaleProvider} from 'antd';
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
        };
    }
    componentDidMount() {
        this.requestdata()
    }
    requestdata=(params) => {//取数据
        post({url:"/api/company/getlist_user"}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data
                })
            }
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
            if(values.range_picker1==undefined&&values.range_picker2==undefined &&values.name==undefined &&values.cteam==undefined){
                this.setState({
                    deleteshow: true,
                })
                return false ;
            }
            if(!err){
                console.log('******************values.cteam',values.cteam);
                
                const data={
                    bdate:this.state.bdate?this.state.bdate.format('YYYY-MM-DD'):'',
                    edate:this.state.edate?this.state.edate.format('YYYY-MM-DD'):'',
                    cname:values.name,
                    pname:values.cteam,   
                }
 
                post({url:"/api/company/getlist",data:data}, (res)=>{
                    if(res.success){
                        this.setState({
                            list: res.data
                        })
                    }
                })
            }
        })
    }

searchOk= () =>{//删除取消
    this.setState({
        deleteshow: false,
    });
};
searchCancel = () =>{//删除取消
    this.setState({
        deleteshow: false,
    });
};

    render() {
        const _this=this;
        const { getFieldDecorator } = this.props.form;
        function onChange_time(date, dateString) {
            _this.setState({
                timeString1:dateString[0],
                timeString2:dateString[1]
            });
        }
        const dateFormat = 'YYYY/MM/DD';
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
                 if(text==4){
                    return ('树莓派企业用户');

                 }if (text==5) {
                    return ('局域网企业用户');
                 } else {
                    return ('树莓派个人用户');
                 }
               
                },
            }];
        return (
            <div className="AdmindUser">
              
                <BreadcrumbCustom first="账号管理" second="用户管理" />
                <Row className="margin_top80 margin_bottom40">
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

                <Table columns={columns} dataSource={this.state.list} />
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.searchOk}
                       onCancel={this.searchCancel}
                >
                    <p>请选择查询的内容 </p>
                </Modal>
            </div>

        )
    }

}

export default AdmindUser=Form.create()(AdmindUser);