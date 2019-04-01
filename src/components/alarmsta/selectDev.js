import React from 'react';
import {  Row, Col, Button,Input,Icon } from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
class selectDev extends React.Component{
    constructor(props){
        super(props);
        this.state={
            page:1,
            pagesize:18,
            list:[],
            listequmpent:[],
        };
    }
    componentDidMount() {
        this.requestdata();//报警信息列表
        this.requestequmpent();
    }
    requestdata=(params) => { //取单位数据
        this.setState({
            loading:true,
        })
        const pageset={
            pagesize:18,
            pageindex:this.state.page,
        }
        post({url:"/api/company/getlist_user",data:pageset}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                    
                },()=>{
                    console.log('this.state.list',this.state.list,this.state.total);
                    
                })
            }
    })
    }
    requestequmpent=() => {//取设备数据
        this.setState({ loading: true });
        const params={
            pagesize:100,
            ccode:this.state.unitcode,
        }
        post({url:'/api/equipment/getlistforadmin',data:params},(res)=>{
            if(res){
                this.setState({
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
                            <div className="cardbody">
                            {
                               this.state.list.map((item)=>(
                                    <div className="cardbodyitem"onClick={ ()=>this.unitcode(item.code) } >
                                        <span>{item.adminname}</span>
                                        <span></span> 
                                    </div>
                               ))
                            }
                            </div>
                        </div>

                        <div className="arrow"><Icon className="arrowicon" type="right-circle" theme="filled" /></div>

                        <div className="selectcard selectcard_right">
                            <div className="cardtit">选择设备（{this.state.totaleq}）</div>
                            <div className="cardbody">
                            {
                               this.state.listequmpent.map((item)=> {
                                    return(
                                        <div className="cardbodyitem">
                                            <a className="itemlink" href={"#/app/alarmsta/onealarm?ccode="+item.ccode+"&cid="+item.cid+"&eid="+item.ecode}  > 
                                                <span>{item.ecode}</span>
                                                <span></span>
                                             </a>
                                        </div>
                                    ) 
                                })
                            }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default selectDev;
