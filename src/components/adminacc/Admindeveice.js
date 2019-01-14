import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {Form, Input, Row, Col, Button, Table, Modal, message, Select, Icon} from 'antd';
import '../../style/sjg/home.css';
import {post} from "../../axios/tools";
import ModaBianhao from './ModaBianhao';
import moment from "moment";
const FormItem = Form.Item;
const Option = Select.Option;
class Admindeveices extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            createinfo:[],
            teamlist:[], //团队列表
            selectedcode:[],//选中的设备
            page:1,
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
        post({url:'/api/company/getlist'},(res)=>{ //获取团队列表
            if(res){
                this.setState({
                    teamlist:res.data,
                }); 
            }   
        })
        
        //取数据
        this.requestdata()
    }
    requestdata=() => {//取数据
        const params={
            pagesize:10,
            ecode:this.state.ecode,
            estatus:this.state.estatus,
            companycode:this.state.companycode,
            pageindex:this.state.page,

        }
        post({url:'/api/equipment/getlistforadmin',data:params},(res)=>{
            if(res){
                this.setState({
                    list:res.data,
                    total:res.totalcount
                }); 
            }   
        })

    }
    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        console.log("page",page);
        this.setState({
            page: page,
        },()=>{
            this.componentDidMount()
        })

    }
    selectopt = (e) => { //检索
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    ecode:values.ecode,
                    estatus: values.estatus,
                    companycode:values.companycode,
                    page:1
                },()=>{
                    this.requestdata();
                })
            }
        })
    }
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }

    onSelectChange = (rowKeys,selectedRows) => { //多选
        let codelist=[];
        selectedRows.map((item) => {
            console.log('item.code',item.code)
            codelist.push(item.code)
        })
        
        codelist.push(selectedRows.map((item,index)=>{
           return item.code
        }))
            console.log('selectedcode',this.state.codelist)
            this.setState({
                selectedRowKeys:rowKeys,
                selectedcode:selectedRows
            });
            console.log('selectedcode',this.state.selectedcode)
    }

    handleOk = (e) => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };
    handleSubmit_search = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('提交的值: ', values);
            }
        });
    };
    newModal = () => { //新增弹窗
        this.setState({
            visible: true,
            type:0,
            inputv:1
        });
    };
    distribute = (e) => {//派发弹窗
        if(this.state.selectedcode.length){
            this.setState({
                visible: true,
                type:1,
                inputv:0
            });
        }else{
           message.warn('请至少选择一个设备'); 
        }
        
    }
    handleCreate = (e) => {//新增/派发提交
        e.preventDefault();
        const forms=this.formRef.formref();
        forms.validateFields((err, values) => {
            console.log('值',values)
            if (!err) {
                if(this.state.type){
                    let codelist=[]
                    this.state.selectedcode.map((item)=>{
                        codelist.push(item.code)
                    })
                    post({url:'/api/equipment/update',data:{companycode:values.companycode,code:codelist[0]}},(res)=>{
                        if(res){
                            this.setState({
                                visible: false,
                            }); 
                            this.requestdata()
                        }
                         
                    })
                }else{
                    if(!values.ecode){
                        message.warn('设备编号不能为空');
                        return;
                    }else{
                        post({url:'/api/equipment/add',data:{ecode:values.ecode}},(res)=>{
                            if(res){
                                let list =this.state.list;
                                list.push({code:res.code,ecode:values.ecode,estatus:0})
                                this.setState({
                                    list:list,
                                    visible: false,
                                }); 
                                forms.resetFields() //清空
                            }
                             
                        })

                    }
                                     

                }
                
            }
        });
    };
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    showModaldelete = (code,index) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            type:code,
            index:index
        });
    }

    deleteOk = () =>{//删除确认
        post({url:'/api/equipment/del',data:{code:this.state.type}},(res)=>{
            if(res){
                let list =this.state.list;
                list.splice(this.state.index,1);
                this.setState({
                    deleteshow: false,
                    list:list,
                });
            }
             
        })
        
    };
    deleteCancel = () =>{//删除取消
        this.setState({
            deleteshow: false,
        });
    };

// 搜索功能
    onChangeto = (e) => {
        const value = e.target.value;
        console.log(value);
    };


    render() {
        const { selectedRowKeys } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [{
            title: '',
            render: (text, record) => (
                record
            ),
        },{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record,index) => (index+1),
        },{
            title: '设备编号',
            dataIndex: 'ecode',
            key: 'ecode',
            render: text => <span>{text}</span>,
        },{
            title: '设备类型',
            dataIndex: 'etype',
            key: 'etype',
            render: text => <span>树莓派</span>,
        },{
            title: '所属团队',
            dataIndex: 'pname',
            key: 'pname',
            render: text => <span>{text}</span>,
        },{
            title: '綁定状态',
            dataIndex: 'estatus',
            key: 'estatus',
            render: (text, record,index) => {
                switch(text){
                    case 0:
                    return `未绑定`;
                    break;
                    case 1:
                    return `已绑定`;
                    break;
                }
            },
        },{
                title: '操作',
                dataIndex: 'code',
                key: 'codedel',
                render: (text, record,index) => {
                    return(
                        <div>
                            {record.estatus === 1
                                ?  null
                                :<span><Button onClick={()=>this.showModaldelete(text,index)}>删除</Button></span>
                            }
                        </div>
                    )
                }
            }];


        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            onSelection: this.onSelection,
            getCheckboxProps: record => ({//禁用已绑定的选项
                disabled: record.estatus === 1,
                estatus: record.estatus,
            }),
        };

        return (
            <div>
                <BreadcrumbCustom first="功能扩展" second="管理员首页" />

                <div className="shange">
                    <Row className="home_top">
                        <Col span={14}>
                            <Form layout="inline" onSubmit={this.selectopt} >
                                <FormItem label="设备编号">
                                    {getFieldDecorator('ecode', {
                                        rules: [{ required: false, message: '请输入设备编号!' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label="设备状态">
                                {getFieldDecorator('estatus', {
                                    initialValue:""
                                })(
                                    <Select style={{ width: 120 }}>
                                        <Option value="">所有</Option>
                                        <Option value="0">未绑定</Option>
                                        <Option value="2">维修中</Option>
                                        <Option value="1">已绑定</Option>
                                    </Select>
                                )}
                                </FormItem>
                                <FormItem label="所属团队">
                                {getFieldDecorator('companycode', {
                                    initialValue:""
                                })(
                                    <Select style={{ width: 120 }}>
                                        <Option value="">所有</Option>
                                    {
                                            this.state.teamlist.map((item, index) => (
                                                <Option value={item.code}>{item.cname}</Option>
                                            ))  
                                        
                                    }

                                    </Select>
                                )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </FormItem>
                            </Form>
                        </Col>

                        <Col span={8} offset={2}>
                            <Row>
                                <Col span={6}>
                                    <Button type="primary" onClick={this.distribute}>派发</Button>

                                </Col>
                                <Col span={6}>
                                    <Button type="primary" onClick={this.newModal}>新增</Button>

                                </Col>
                                <Col span={6}>
                                    <Button type="primary">导入</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <div>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={this.state.list}
                            pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                        />
                    </div>
                </div>


                <div className="download_btn"><Button type="primary">下载导入模板</Button> </div>
                <Modal
                    title={this.state.type?'派发设备':'新增设备'}
                    visible={this.state.visible}
                    onOk={this.handleCreate}
                    onCancel={this.handleCancel}
                    okText={"确认"}
                    cancelText={"取消"}
                >

                    <ModaBianhao visible={this.state.visible} code={this.state.type} inputv={this.state.inputv} wrappedComponentRef={(form) => this.formRef = form} />

                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                       onCancel={this.deleteCancel}
                >
                    <p>确认删除吗？</p>
                </Modal>
            </div>
        )
    }

}
const Admindeveice= Form.create()(Admindeveices);
export default Admindeveice;