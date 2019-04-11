import React, { Component } from 'react';
import {Form,Input,} from 'antd';
// import '../../style/sjg/home.css';
import axios from 'axios';
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
        console.log('dddd',this.props.code)
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
        if(this.state.code){
            axios.get("table.json").then((res)=>{
                if(res.data.success){
                    let editdata=res.data.data[this.state.code];
                    this.props.form.setFieldsValue({
                      title: `${editdata.name}`,
                      jingdu: `${editdata.x}`,
                      weidu: `${editdata.y}`,
                      linkname: `${editdata.username ? editdata.username : "张三"}`,
                      tel: `${editdata.tel}`
                    });
                    
                }
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
                        {getFieldDecorator('jingdu', {
                            rules: [{ required: true, message: '请输入经度!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="维度">
                        {getFieldDecorator('weidu', {
                            rules: [{ required: true, message: '请输入经度!' }],
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
                    <FormItem label="电话">
                        {getFieldDecorator('tel', {
                            rules: [{ required: true, message: '请输入电话!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>

        )
    }


}

export default ModalForm = Form.create({})(ModalForm);