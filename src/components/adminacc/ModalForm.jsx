import React, { Component } from 'react';
import {Form,Input,} from 'antd';
// import '../../style/sjg/home.css';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
class ModalForm extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false
        };
    }
    componentDidMount() {
        //编辑  数据回填
        this.setState({
            code:this.props.code
        });
        this.updatedata()
    }
    componentDidUpdate = () => {
        if(this.props.code && this.props.code!==this.state.code){
            this.setState({
                code:this.props.code
            }, () => {this.updatedata() });
        }      
    }
    formref = () => { //将form传给父组件由父组件控制表单提交
        const aa=this.props.form.getFieldsValue();
        return this.props.form;
    };
    updatedata = () => {
        if(this.props.code){
            console.log('this.props.code',this.props.code)
            let code={
                comid:this.props.code
            };
            post({url:"/api/company/getone",data:code},(res)=>{
                console.log(res.data);
                this.props.form.setFieldsValue({
                    title: res.data.cname,
                    clng: res.data.clng,
                    clat: res.data.clat,
                    linkname: res.data.adminname,
                    tel:res.data.adminaccount,
                });
            }) 
        }
    }; 
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem label="名称">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入名称!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="经度">
                        {getFieldDecorator('clng', {
                            rules: [{ 
                                required: true, message: '请输入合法的经度!',
                                pattern: new RegExp( /^\d*\.{0,6}\d{0,6}$/, "g"),
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="纬度">
                        {getFieldDecorator('clat', {
                            rules: [{ 
                                required: true, message: '请输入合法的纬度',
                                pattern: new RegExp( /^\d*\.{0,6}\d{0,6}$/, "g"),
                             }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="联系人">
                        {getFieldDecorator('linkname', {
                            rules: [{ required: true, message: '请输入联系人!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="联系电话">
                        {getFieldDecorator('tel', {
                            rules: [
                            { required: true, message: '请输入合法的手机号!',
                             pattern: new RegExp(/^1(3|4|5|7|8)\d{9}$/, "g"),
                            }
                             ],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
        )
    }
}
export default ModalForm = Form.create({})(ModalForm);