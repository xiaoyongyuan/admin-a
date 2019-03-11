import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Table, Row, Col, Form, Input, Button ,DatePicker,Spin,LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import '../../style/yal/home.css';
const FormItem = Form.Item;
const { RangePicker } = DatePicker ;
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
requestdata=() => { //取数据
        const params={
            pagesize:10,
            pageindex:this.state.page,
            bdate:this.state.bdate,
            edate:this.state.edate,
            eid:this.state.eid,
        };
        post({url:"/api/smptask/getlist",data:params}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                    loading: false,//加载状态
                })
            }else{
                this.setState({
                    loading: false,//加载状态
                })
            }
        })
};
changePage=(page)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
    this.setState({
        page: page,
        ecode:'',
        loading:true
    },()=>{
        this.componentDidMount()
    })
}

selectopt = (e) => { //检索search
    this.setState({
        loading:true
    });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    bdate:values.date && values.date.length?values.date[0].format('YYYY-MM-DD'):"",
                    edate:values.date && values.date.length?values.date[1].format('YYYY-MM-DD'):"",
                    ecode: values.ecode,
                    cname:values.cname,
                    page:1,
                    eid:values.eid,
                },()=>{
                    this.componentDidMount()
                })

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
            <LocaleProvider locale={zh_CN}>
            <div className="AsynHistory">
                <BreadcrumbCustom first="异步历史"/>
                <div className="shange">
                <Row>
                        <Col span={14}>

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

                                    <FormItem label="日期" >
                                        {getFieldDecorator('date')(
                                            <RangePicker
                                                placeholder={['开始时间', '结束时间']}
                                            />
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
                        <Spin spinning={this.state.loading} size="large" className="spin" tip="加载中...">
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
            </LocaleProvider>
        )
    }
}

export default AsynHistory= Form.create({})(AsynHistory);