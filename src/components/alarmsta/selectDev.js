import React from 'react';
import {Icon,message,Spin} from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
class selectDev extends React.Component{
    constructor(props){
        super(props);
        this.state={
            page:1,
            pagesize:14,
            list:[],
            listequmpent:[],
            isrequest:true,//是否请求接口
            loading:true,//加载中的状态
            load:false,//右边加载中的状态
        };
    }
    componentDidMount() {
        this.requestdata();//报警信息列表
        this.scollbottom();
    }
    scollbottom=()=>{
        var _this=this;
        let pag=2;
        document.getElementById("scorll").onscroll=function() {
            var scrollHeight = document.getElementById("scorll").scrollHeight;//div里内容的高度
            var scrollTop = document.getElementById("scorll").scrollTop;//0-18
            var clientHeight = document.getElementById("scorll").clientHeight;//div内里框框的高度
            var scrollbottom=scrollHeight-clientHeight;
            var scrollTopP=Math.floor(scrollTop);
            if(scrollbottom-scrollTopP===0){//滚动到底部了
                if(_this.state.isrequest){ 
                        _this.setState({
                            loading:true,
                            page:pag,
                        },()=>{

                        })
                        const pageset={
                            pagesize:14,
                            pageindex:_this.state.page,
                        }
                        post({url:"/api/company/getlist_user",data:pageset}, (res)=>{
                            if(res.success){
                                if(res.data.length>0){
                                    pag++;
                                    const list=_this.state.list;
                                    const alist = list.concat(res.data);
                                    _this.setState({
                                         list: alist,
                                         loading: false,
                                         loadtip:"加载中...",
                                    })
                                }else{
                                    if(res.data.length===0){
                                        message.success('没有更多了');
                                        _this.setState({
                                            isrequest: false,
                                            loadtip:false,
                                            loading:false,
                                        })
                                    }
                                }
                            }
                    })
                }
            }
        }
    }

    requestdata=(params) => { //取单位数据
        
        const pageset={
            pagesize:14,
            pageindex:this.state.page,
        }
        post({url:"/api/company/getlist_user",data:pageset}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                    unitcode:res.data[0].code,
                    loading:false,
                },()=>{
                    this.requestequmpent();
                })
            }
        })
    }
    requestequmpent=() => {//取设备数据
        this.setState({load:true}); 
        const params={
            pagesize:100,
            ccode:this.state.unitcode,
        }
        post({url:'/api/equipment/getlistforadmin',data:params},(res)=>{
            if(res){
                this.setState({
                    load:false,
                    listequmpent:res.data,
                    totaleq:res.totalcount,
                }); 
            }   
        })

    }
    unitcode=(code) =>{ //点击获取设备code
        this.setState({
            unitcode: code,
        },()=>{
            this.requestequmpent();
        });
    }

    render(){
        return(
            <div className="selectDev">
                <div className="selectcontent">
                    <div className="devtittle"><span>已选择:</span><span>1</span>><span>12</span> </div>
                    <div className="selectframe">
                        <div className="selectcard">
                            <div className="cardtit">选择单位（{this.state.total}）</div>
                                <div className="cardbody"id="scorll">
                                    <Spin spinning={this.state.loading} size="large" className="spin" tip="加载中..." >
                                        {
                                        this.state.list.map((item)=>(
                                            <div key={item.code} className="cardbodyitem"onClick={ ()=>this.unitcode(item.code) } >
                                                <span>{item.adminname}</span>
                                                <span></span> 
                                            </div>
                                        ))
                                        }
                                    </Spin>
                                </div>
                        </div>
                        <div className="arrow"><Icon className="arrowicon" type="right-circle" theme="filled" /></div>

                        <div className="selectcard selectcard_right">
                            <div className="cardtit">选择设备（{this.state.totaleq}）</div>
                            <div className="cardbody">
                            <Spin spinning={this.state.load} size="large" className="spin" tip="加载中..." >
                                {
                                this.state.listequmpent.map((item)=> (
                                        
                                            <div key={item.code} className="cardbodyitem">
                                                <a className="itemlink" href={"#/app/alarmsta/onealarm?ccode="+item.ccode+"&cid="+item.cid+"&eid="+item.ecode}  > 
                                                    <span>{item.ecode}</span>
                                                    <span></span>
                                                </a>
                                            </div>
                                    
                                    ))
                                }
                            </Spin>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default selectDev;
