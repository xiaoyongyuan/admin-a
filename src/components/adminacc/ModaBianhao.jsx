import React, { Component } from 'react';
import {Form,Input, Select} from 'antd';
import {post} from "../../axios/tools";


const Option = Select.Option;

const FormItem = Form.Item;


class ModaBianhao extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false,
            teamlist:[],
        };
    }
    componentWillMount() {
        post({url:'/api/company/getlist'},(res)=>{
            if(res){
                this.setState({
                    teamlist:res.data,
                }); 
            }   
        })
    }



    componentDidUpdate = () => {
        if(this.props.code && this.props.code!=this.state.code){
            this.setState({
                code:this.props.code
            }
            , () => {
                // this.updatedata()
            });

        }
    }
    formref = () => { //将form传给父组件由父组件控制表单提交
        const aa=this.props.form.getFieldsValue();
        return this.props.form;
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical" >
                <div style={{display:this.props.inputv?"block":"none"}}>
                <FormItem label="设备编号">
                    {getFieldDecorator('ecode', {
                        rules: [{ required: false, message: '请输入设备编号!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                </div>

                <div style={{display:this.props.inputv?"none":"block"}}>
                <FormItem
                    label="选择团队"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}
                >
                    {getFieldDecorator('companycode', {
                        rules: [{ required: false, message: '请选择团队!' }],
                    })(
                        <Select
                            placeholder="请选择团队"
                            onChange={this.handleSelectChange}
                        >
                            {
                                this.state.teamlist.map((item, index) => (
                                    <Option key={item.code} value={item.code}>{item.cname}</Option>
                                ))  
                                
                            }
                        </Select>
                    )}
                </FormItem>
                </div>
        </Form>
        )
    }
}

export default ModaBianhao = Form.create({})(ModaBianhao);