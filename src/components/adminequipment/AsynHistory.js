import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Table, Row, Col, Form, Input, Button ,DatePicker,Spin,LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import '../../style/yal/home.css';
const FormItem = Form.Item;
class AsynHistory extends Component {
constructor(props){
    super(props);
    this.state={         
        list:[],
        createinfo:[],
        page:1,
        loading: true,//加载状态
    };
}
componentDidMount() {
    this.requestdata();
}
requestdata=(params) => { //取数据
    this.props.form.validateFields((err, values) => {
        const params={
            pagesize:10,
            pageindex:this.state.page,
            bdate:this.state.bdate?this.state.bdate.format('YYYY-MM-DD 00:00:00'):'',
            edate:this.state.edate?this.state.edate.format('YYYY-MM-DD 59:59:59'):'',
            eid:values.eid, 
        }
        post({url:"/api/smptask/getlist",data:params}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                    loading: false,//加载状态
                })
            }
        })
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
                title: '任务名称',
                dataIndex: 'taskmemo',
                key: 'taskmemo',
            },{
            title: '设备编号',
            dataIndex: 'eid',
            key: 'eid',
               
            }, {
                title: '时间',
                dataIndex: 'createon',
                key: 'createon',
            }];


        return ( 
            <div className="AsynHistory">
            
                    
                <BreadcrumbCustom first="异步历史"/>
              
                <div className="shange">
                <Row>
                        <Col span={14}>
                            <LocaleProvider locale={zh_CN}>
                                <Form layout="inline" onSubmit={this.selectopt}>
                                    <FormItem label="设备编号">
                                        {getFieldDecorator('eid', {
                                            rules: [{
                                                required: false,
                                                message: '请输入设备编号!',
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    
                                    <FormItem label="时间">
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
                                    <FormItem>
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                    </FormItem>
                                </Form>
                            </LocaleProvider>
                        </Col>
                    </Row>
                    <Row>
                        <Spin spinning={this.state.loading} size="large" className="spin" tip="Loading...">  
                            <Table style={{marginTop:'24px'}}
                                bordered={true}
                                dataSource={this.state.list}
                                columns={columns}
                                pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                            />
                        </Spin>
                    </Row>
                </div>
            </div>
        )
    }
}

export default AsynHistory= Form.create({})(AsynHistory);