import React, { Component } from 'react';
import {Form,Input, Row, Col, Button , Modal,Icon ,DatePicker,Select,Option} from 'antd';
// import '../../style/sjg/home.css';
import axios from 'axios';

const FormItem = Form.Item;


class ModaBianhao extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false
        };
    }
    componentDidMount() { }

    formref = () => { //将form传给父组件由父组件控制表单提交
        const aa=this.props.form.getFieldsValue(); 
        return this.props.form;
    };

    componentDidUpdate = () => {
        if(this.props.code && this.props.code!=this.state.code){
            this.setState({
                code:this.props.code
            }, () => {this.updatedata() });
            
        }      
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>y



                <FormItem
                    label="Gender"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}
                >
                    {getFieldDecorator('gender', {
                        rules: [{ required: true, message: 'Please select your gender!' }],
                    })(
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={this.handleSelectChange}
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                        </Select>
                    )}
                </FormItem>


        </Form>
        )
    }
}

export default ModaBianhao = Form.create({})(ModaBianhao);