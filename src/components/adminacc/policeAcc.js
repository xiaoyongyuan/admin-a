import React, { Component} from 'react';
import {Form, Row, Col, Button,Icon,Modal,Input} from 'antd';
import {post} from "../../axios/tools";
import "../../style/sjg/icon/iconfont.css";
import CascaderModule from '../common/CascaderModule';
const FormItem = Form.Item;
var province
var utype
var zcode

class policeAccs extends Component {
    constructor(props){
        super(props);
        this.state={
          options:[],//产品类型option
          addblock:false,//新增弹框
          modeltype:false,
          list:[],
        };
    }
    componentDidMount() {
        
        this.requestdata();
        
    }


    addblock=()=>{
      this.setState({
        addblock:true,//新增弹框
        modeltype:true,
      });
    }
    editblock=()=>{
        this.setState({
          addblock:true,//新增弹框
          modeltype:false,
        });
      }
    selectobjCancel = (e) => {//关闭弹框
        this.setState({
          addblock:false,
        });
        
    }
    selectobjOk= (e) => {//modal提交
        this.props.form.validateFields((err, values) => {
            const va= this.child.formref()
           if(!err){
                if(this.state.modeltype){
                    //新增
                    var data={
                        zonecode: va.zonecode,
                        usertype: va.usertype,
                        account:values.account,
                        realname:values.realname,
                    };
                    post({url:"/api/usercop/add",data:data},(res)=>{
                        if(res.success){
                            const list=this.state.list;
                            list.unshift(data);
                            this.setState({list})
                        }
                    })
                }else{
                    console.log('编辑接口');
                   
                } 
                this.setState({
                    addblock:false,//新增弹框
                },()=>{
                    this.requestdata();
                });
         }
       })
         
    }
    onRef = (ref) => {
      this.child = ref
    }
    sure=()=>{
         province=this.child.formref()
        if(province.usertype===-1){
            utype=""
            zcode=province.zonecode;
        }else{
            utype=province.usertype;
            zcode=province.zonecode;
        }
        this.requestdata();
      }
    requestdata=(params) => { //取数据
        this.setState({
            loading:true,
        })
        
        post({url:"/api/usercop/getlist",data:{usertype:utype,zonecode:zcode}}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                })
            }
        })
    }
    render() {
      const { getFieldDecorator } = this.props.form;
        return (
            <div className="policeAcc">
             <Row className="updownmargin20">
                <Col span={5}>
                <div style={{float:"left",height:"34px",lineHeight:"34px"}}> 选择区域：</div> 
                <span style={{float:"left"}}> <CascaderModule style={{width:'100%'}} onRef={this.onRef} /></span>
                </Col> 
                <Col span={2}>
                    <Button type="primary" onClick={()=>this.sure()}>
                        确定
                    </Button>
                </Col> 
                <Col span={6}>
                    <Button type="primary" onClick={()=>this.addblock()}>
                        新增
                    </Button>
                </Col>
              
             </Row>
              {
                this.state.list.map((item)=>(
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
                                        <div><span className="iconfont icon-renyuanguanli" /> {item.account} </div>
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
                        <div className="areaContentBottom" onClick={()=>this.editblock()}>
                        <span><Icon type="form" /> 编辑</span>   
                        </div>
                    </div>
                  ))
                }
           
              <Modal visible={this.state.addblock} 
                      title={this.state.modeltype?"新增":"编辑"}
                      okText="确认"
                      cancelText="取消"
                      onCancel={() => this.selectobjCancel()}
                      onOk={() => this.selectobjOk()}
              >
                <Form layout="vertical" >
                    <FormItem label="区域">
                        {getFieldDecorator('area', {
                            rules: [{ required: false, message: '请输入区域!' }],
                        })(
                            <CascaderModule onRef={this.onRef} />
                        )}
                    </FormItem>

                    <FormItem label="管理员账号">
                        {getFieldDecorator('account', {
                            rules: [{ required: true, message: '请输入管理员账号!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="联系人">
                        {getFieldDecorator('realname', {
                            rules: [{ required: false, message: '请输入联系人!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="联系人电话">
                        {getFieldDecorator('linktell', {
                            rules: [{ required: false, message: '请输入联系人电话!' }],
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