import React, { Component} from 'react';
import {Form, Row, Col, Button,Icon,Modal,Input} from 'antd';
import {post} from "../../axios/tools";
import "../../style/sjg/icon/iconfont.css";
import ProvinceForm from './ProvinceForm';
const FormItem = Form.Item;
class policeAccs extends Component {
    constructor(props){
        super(props);
        this.state={
          options:[],//产品类型option
          addblock:false,//新增弹框
        };
    }
    addblock=()=>{
      this.setState({
        addblock:true,//新增弹框
      });
    }
    selectobjCancel = (e) => {//modal提交
        this.setState({
          addblock:false,//新增弹框
        });
       
    }
    selectobjOk= (e) => {//modal提交
      this.setState({
        addblock:false,//新增弹框
      });
      this.props.form.validateFields((err, values) => {
        console.log('linktell', values.area,values.glyzh,values.ren,values.linktell);
          if(!err){
              this.setState({
                area: values.area,
                glyzh:values.glyzh,
                ren:values.ren,
                linktell:values.linktell,
              },()=>{
                console.log('4444',this.state.area,this.state.glyzh,this.state.ren,this.state.linktell);
              })
          }
      })
    }
 


    
    render() {
      const { getFieldDecorator } = this.props.form;
        return (
            <div className="policeAcc">
             <Row className="updownmargin20">
                <Form layout="inline" onSubmit={this.selectopt} >
                    <FormItem label="">
                        <ProvinceForm />
                    </FormItem>
                    <FormItem>
                        <Button type="primary">
                            确定
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={()=>this.addblock()}>
                            新增
                        </Button>
                    </FormItem>
                            
                </Form>
             </Row>
             <div className="areaContent">
               <div className="areaContentTop">
                   <div className="areatit">
                      陕西 西安 高新
                   </div>
                   <div className="areacon">
                        <div className="areaitem">
                            <Row className="areaconLine">
                                <div><span className="iconfont icon-ren" />  张警官</div>
                                <div><span className="iconfont icon-dianhua" /> 131123456789</div>
                            </Row>
                            <Row className="areaconLine">
                                <div><span className="iconfont icon-renyuanguanli" /> 这是账号   </div>
                                <div><span className="iconfont icon-ai-connection" /> 4545</div>
                            </Row>
                        </div>
                        <div className="areaitem">
                            <Row className="areaconLine">
                                <div><span>管辖设备：</span> <span>56</span></div>
                                <div><span>管辖用户：</span> <span>89</span></div>
                            </Row>
                            <Row className="areaconLine">
                                <div><span>报警数    ：</span> <span>56</span></div>
                                <div><span>未处理报警数：</span> <span style={{color:'red'}}>180</span></div>
                            </Row>
                        </div>
                   </div>
               </div>
               <div className="areaContentBottom">
                <span><Icon type="form" /> 编辑</span>   
               </div>
             </div>
              <Modal visible={this.state.addblock} 
                      title="信息"
                      okText="确认"
                      cancelText="取消"
                      onCancel={() => this.selectobjCancel()}
                      onOk={() => this.selectobjOk()}
              >
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem label="区域">
                        {getFieldDecorator('area', {
                            rules: [{ required: true, message: '请输入区域!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem label="管理员账号">
                        {getFieldDecorator('glyzh', {
                            rules: [{ required: true, message: '请输入管理员账号!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="联系人">
                        {getFieldDecorator('ren', {
                            rules: [{ required: true, message: '请输入联系人!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="联系人电话">
                        {getFieldDecorator('linktell', {
                            rules: [{ required: true, message: '请输入联系人电话!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                   
                </Form>
              </Modal>
          </div>
        )
    }
}
const policeAcc= Form.create()(policeAccs);
export default policeAcc;