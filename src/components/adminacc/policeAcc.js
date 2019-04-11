/* eslint-disable react/jsx-boolean-value */
import React, { Component} from 'react';
import {Form, Row, Button,Icon,Modal,Input,message,Pagination} from 'antd';
import {post} from "../../axios/tools";
import "../../style/sjg/icon/iconfont.css";
import CascaderModule from '../common/CascaderModule';
const FormItem = Form.Item;
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
          page:1, //当前页数
          pageSize:12, //每页显示数量
          totalcount:0, //数据总量
        };
    }
    componentDidMount() {
        this.requestdata();
    }
    hanlePageSize = (page) => { //翻页
        this.setState({
            page:page,
        },()=>{
            this.requestdata();
        })
    };
    editblock=(account,ccode,code)=>{
        this.setState({
          addblock:true,//编辑弹框
          modeltype:false,
          ccode:ccode,
          account:account,
          disable:true,//禁止input输入
          code:code
        },()=>{
            this.requestedit();
        });
      }
      requestedit=() => {//取数据
        if(this.state.ccode){
            const data={
                account:this.state.account,
                zonecode:this.state.ccode,
            }
           
            post({url:"/api/usercop/getone",data:data }, (res)=>{
                    this.props.form.setFieldsValue({
                        account: res.data.account,//账号
                        realname: res.data.realname,//姓名
                        copID: res.data.copID,//
                        linktel: res.data.linktel,//
                        area: res.data.zonename,//
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

    selectobjCancel = (e) => {//关闭弹框
        this.setState({
          addblock:false,
        });
        
    }
    selectobjOk= (e) => {//modal提交
        this.props.form.validateFields((err, values) => {
           if(!err){
                if(this.state.modeltype){
                    const va= this.child.formref()
                    //新增
                    var data={
                        zonecode: va.zonecode,
                        usertype: va.usertype,
                        account:values.account,
                        realname:values.realname,
                        copID:values.copID,
                        linktel:values.linktel,
                        zonename: va.zonename,
                        addtype:1,
                    };
                    if(data.zonecode){
                        post({url:"/api/usercop/add",data:data},(res)=>{
                            if(res.success){
                                const list=this.state.list;
                                list.unshift(data);
                                this.setState({list})
                                message.success('新增成功');
                                this.requestdata();
                            }
                        })
                    }else{
                        message.error('请选择区域');
                        return
                    }
                    
                }else{
                      //编辑接口');
                            const datab={
                                realname:values.realname,
                                copID:values.copID,
                                linktel:values.linktel,
                                code:this.state.code
                            };
                            post({url:"/api/usercop/update",data:datab}, (res)=>{
                                message.success('修改成功');  
                                this.requestdata();
                            })        
                            
                }
                this.setState({
                    addblock:false,//新增弹框
                });
         }
       })
         
    }
    onRef = (ref) => {
      this.child = ref
    }
    sure=()=>{
        this.requestdata();
      }
    searchsure=()=>{
        this.setState({
            page:1,
            },()=>{
                this.requestdata();
            })
    }
    sear=(e)=>{
       this.setState({
       searchvalue:e.target.value
       })
    }
    requestdata=(params) => { //取数据
        this.setState({
            loading:true,
        })
        const searchvalue={
            zonename:this.state.searchvalue,
            pageindex:this.state.page,
            pagesize:12,
        }
        post({url:"/api/usercop/getlist",data:searchvalue}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    totalcount:res.totalcount,
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
                    <div style={{float:"left",height:"34px",lineHeight:"34px"}}> 区域：</div> 
                    <span style={{float:"left"}}> 
                    {/* <CascaderModule style={{width:'100%'}} onRef={this.onRef} /> */}
                    <Input onBlur={(e)=>this.sear(e)} />
                    </span>
                    </div> 
                <div className="polsurch polsurchtwo">
                    <Button type="primary" onClick={()=>this.searchsure()}>
                        搜索
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
                            {item.zonename}
                            </div>
                            <div style={{paddingLeft:'8px'}}className="qym">
                               区域码：<span>{item.companycode}</span>
                            </div>
                            <div className="areacon">
                                <div className="areaitem">
                                    <Row className="areaconLine">
                                        <div> <span title="联系人"> <span className="iconfont icon-ren" /> {item.realname?item.realname:" 空"}</span></div>
                                        <div> <span title="编号"><Icon type="qrcode" /> {item.copID?item.copID:" 无"} </span> </div>
                                    </Row>
                                    <Row className="areaconLine">
                                        <div><span title="管理员账号"><span className="iconfont icon-renyuanguanli" /> {item.account}</span> </div>
                                        <div><span title="用户数量"><span className="iconfont icon-ai-connection" /> {item.usercount}</span></div>
                                    </Row>
                                </div>
                            </div>
                        </div>
                        <div className="areabtit">
                            <div className="areaContentBottom" onClick={()=>this.editblock(item.account,item.companycode,item.code)}>
                               <span><Icon type="form" /> 编辑</span>   
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
                            rules: [{ required: true, message: '请输入联系人!'}],
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
                            rules: [
                                { required: false,message: "请输入用户名(手机号)!"},
                                {pattern: new RegExp("^[0-9]*$"), message: "请输入正确格式联系人电话!"}
                            ]
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
             
              <Pagination hideOnSinglePage={true} style={{float:"left"}} defaultCurrent={this.state.page} current={this.state.page} total={this.state.totalcount} pageSize={this.state.pageSize} onChange={this.hanlePageSize} className="pageSize" />
          </div>
        )
    }
}
const policeAcc= Form.create()(policeAccs);
export default policeAcc;