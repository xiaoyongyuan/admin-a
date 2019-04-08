import React, { Component} from 'react';
import {Form, Row, Col, Button,Icon,Modal,Input,message} from 'antd';
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
          delblock:false,//删除弹框
          list:[],
          disab:true,//input框禁用
        };
    }
    componentDidMount() {
        this.requestdata();
    }
    editblock=(account,ccode)=>{
        // console.log('****************33**',account,ccode);
        this.setState({
          addblock:true,//编辑弹框
          modeltype:false,
          ccode:ccode,
          account:account,
          disable:true,//禁止input输入
        },()=>{
            this.requestedit();
        });
      }
      requestedit=() => {//取数据
        console.log('getone1',this.state.ccode,this.state.account,);
        if(this.state.ccode){
            const data={
                account:this.state.account,
                zonecode:this.state.ccode,
            }
           
            post({url:"/api/usercop/getone",data:data }, (res)=>{
                console.log('getone',res);
                    this.props.form.setFieldsValue({
                        account: res.data.account,//账号
                        realname: res.data.realname,//姓名
                        copID: res.data.copID,//姓名
                        linktel: res.data.linktel,//姓名
                    });
            })
        }
    }

    addblock=()=>{
      this.props.form.resetFields() //清空
      this.setState({
        addblock:true,//新增弹框
        modeltype:true,//判断新增还是编辑
        disable:false,//禁止input输入关闭
      });
    }
    delblock=(e)=>{ //删除
        this.setState({
            delblock:true,
            delcode:e,
          });
    }

    delCancel= (e) => {//关闭删除弹框
        this.setState({
            delblock:false,
        });
    }
    delOk= (e) => {//关闭删除弹框
        
        this.setState({
            delblock:false,
        });
        post({url:"/api/usercop/del",data:{zonecode: this.state.delcode}},(res)=>{
            if(res.success){
                this.requestdata();
            }
        })
        message.success('删除成功');
    }
    selectobjCancel = (e) => {//关闭弹框
        this.setState({
          addblock:false,
        });
        
    }
    selectobjOk= (e) => {//modal提交
        this.props.form.validateFields((err, values) => {
            console.log('values.copID',values.copID,values.linktel);
            const va= this.child.formref()
           if(!err){
                if(this.state.modeltype){
                    //新增
                    var data={
                        zonecode: va.zonecode,
                        usertype: va.usertype,
                        account:values.account,
                        realname:values.realname,
                        copID:values.copID,
                        linktel:values.linktel,
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
                      //编辑接口');
                            var data={
                                usertype: va.usertype,
                                realname:values.realname,
                            };
                            post({url:"/api/usercop/update",data:data}, (res)=>{
                                if(res.success){
                                    let list=this.state.list;
                                    list[this.state.index]=res.data[0];                        
                                    this.setState({
                                        list:list,
                                    })
                                }   
                            })        
                            province=this.child.formref()
                            province.zonecode=""
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
                <div className="polsurch">
                    <div style={{float:"left",height:"34px",lineHeight:"34px"}}> 选择区域：</div> 
                    <span style={{float:"left"}}> <CascaderModule style={{width:'100%'}} onRef={this.onRef} /></span>
                    </div> 
                <div className="polsurch polsurchtwo">
                    <Button type="primary" onClick={()=>this.sure()}>
                        确定
                    </Button>
                </div> 
                <div className="polsurch polsurchthree">
                    <Button type="primary" onClick={()=>this.addblock()}>
                        新增
                    </Button>
                </div>
              
             </Row>
              {
                this.state.list.map((item)=>(
                    <div key={item.code} className="areaContent">
                        <div className="areaContentTop">
                            <div className="areatit">
                            陕西 西安 高新
                            </div>
                            <div style={{paddingLeft:'8px',marginTop:"8px"}}>
                               区域码：<span>{item.companycode}</span>
                            </div>
                            <div className="areacon">
                                <div className="areaitem">
                                    <Row className="areaconLine">
                                        <div> <span title="姓名"> <span className="iconfont icon-ren" /> {item.realname?item.realname:" 空"}</span></div>
                                        <div> <span title="编码"><Icon type="align-left" /> {item.copID?item.copID:" 空"} </span> </div>
                                    </Row>
                                    <Row className="areaconLine">
                                        <div><span title="账号"><span className="iconfont icon-renyuanguanli" /> {item.account}</span> </div>
                                        <div><span title="账号数量"><span className="iconfont icon-ai-connection" /> 4545</span></div>
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
                        <div>
                            <div className="areaContentBottom" onClick={()=>this.editblock(item.account,item.companycode)}>
                               <span><Icon type="form" /> 编辑</span>   
                            </div>
                            <div className="areaContentBottom" onClick={()=>this.delblock(item.companycode)}>
                               <span><Icon type="delete" /> 删除</span>   
                            </div>
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
                    <FormItem label={true?<span><span style={{color:"red",fontSize:"17px"}}>* </span> 区域</span>:"" }>
                        {getFieldDecorator('area', {
                            rules: [{ required: false, message: '请输入区域!' }],
                        })(
                            this.state.modeltype?<CascaderModule onRef={this.onRef} />:<Input disabled={this.state.disable} />
                        )}
                    </FormItem>

                    <FormItem label="管理员账号">
                        {getFieldDecorator('account', {
                            rules: [{ required: true, message: '请输入管理员账号!' }],
                        })(
                            <Input disabled={this.state.disable} />
                        )}
                    </FormItem>
                    <FormItem label="联系人">
                        {getFieldDecorator('realname', {
                            rules: [{ required: true, message: '请输入联系人!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="编号">
                        {getFieldDecorator('copID', {
                            rules: [{ required: true, message: '请输入编号!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="联系人电话">
                        {getFieldDecorator('linktel', {
                            rules: [{ required: false, message: '请输入联系人电话!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                   
                </Form>
              </Modal>
              <Modal visible={this.state.delblock} 
                      title="删除"
                      okText="确认"
                      cancelText="取消"
                      onCancel={() => this.delCancel()}
                      onOk={() => this.delOk()}
              >
               <div>是否确认删除？</div>
              </Modal>
          </div>
        )
    }
}
const policeAcc= Form.create()(policeAccs);
export default policeAcc;