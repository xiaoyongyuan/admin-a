import React, { Component } from 'react';
import {Form,Input, Cascader} from 'antd';
// import '../../style/sjg/home.css';
import axios from 'axios';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
class ProvinceForm extends Component {
    constructor(props){
        super(props);
        this.state={
           
        };
    }

    
    componentDidMount() {
        this.setState({
            // code:this.props.code
        });
        this.requestdata();
    }
  
      requestdata=() => { //取省数据
        const pageset={}
        post({url:"/api/zonecode/gets_province",data:pageset}, (res)=>{
            if(res.success){
                this.setState({
                  provincelist: res.data,
                },()=>{
                  console.log('provincelist',this.state.provincelist);
                })
            }
        })
    }
    
    formref = () => { //将form传给父组件由父组件控制表单提交
        const aa=this.props.form.getFieldsValue();
        return this.props.form;
    };
    render() {
        const { getFieldDecorator } = this.props.form;

        
        const options = [{
            value: 'zhejing',
            label: '浙江',
            children: [{
              value: 'hangzhou',
              label: '杭州',
              children: [{
                value: 'xihu',
                label: '西湖',
              }],
            }],
          }, {
            value: 'jiangsu',
            label: '江苏',
            children: [{
              value: 'nanjing',
              label: '南京',
              children: [{
                value: 'zhonghuamen',
                label: '中华门',
              }],
            }],
          }];
         function onChange(value) {
            console.log(value);
          }
        return (
          <div>
               <Form layout="inline" onSubmit={this.selectopt} >
                <FormItem label="选择区域">
                        {getFieldDecorator('minProduct', {
                            rules: [{ required: false, message: '请输入设备编号!' }],
                        })(
                            <Cascader options={options}
                                    expandTrigger="hover"
                                    onChange={onChange} 
                                    placeholder="请选择"
                            />
                        )}
                    </FormItem>
            </Form>
          </div>
        )
    }


}

export default ProvinceForm= Form.create({})(ProvinceForm);