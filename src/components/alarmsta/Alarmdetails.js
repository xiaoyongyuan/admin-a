import React from 'react';
import {Button, Switch, Icon, Popconfirm } from 'antd';
import {post} from "../../axios/tools";
import "../../style/ztt/css/police.css";
const ButtonGroup = Button.Group;
let vis=false;
 var ex;
 var ey;
class Alarmdetails extends React.Component{
	constructor(props){
      super(props);
      this.state={
      	data:{ //请求的数据
      		src:'',
      		name:'',
      		tags:'',
      		type:'1',
            atime:'',
      		field:[],
          finalresult:[],
      
      	},
      	field:true, //是否显示围界信息
      	obj:true, //是否显示报警对象
      	prev:'', //上一条数据code
      	next:'', //下一条数据code
      	code:'', //当前数据的code
      };
  }
  componentWillMount() {
    const activecompcode=localStorage.getItem('activecompcode');
  	//此处拿到父页面参数
    this.setState({
      faths:this.props.toson,
      code:this.props.toson.code,
      activecompcode:activecompcode && activecompcode !='undefined'?activecompcode:''
    });
  }
  componentDidMount() {
       this.request();
       
    } ;
  componentWillReceiveProps(nextProps){ //此处修改父页面参数
      if( nextProps.visible !== vis){
          vis=nextProps.visible;
          if(nextProps.visible){
              vis=nextProps.visible;
              this.setState({
                  code:nextProps.toson.code,
                  faths:nextProps.toson
              }, () => {
                  this.componentDidMount()});
          }
      }        
  }
  request=()=>{
    post({url:"/api/alarm/getone_foradmin",data:Object.assign(this.state.faths,{passivecode:this.state.activecompcode})},(res)=>{        
      let data={
          src:res.data.picpath,
          field:res.data.field,
          name:res.data.name,
          alarmtype:res.data.alarmtype,
          finalresult:res.data.finalresult1,
          atime:res.data.atime,
          type:res.data.status,   
          tags:res.data.tags, 
          pic_width:res.data.pic_width, //报警宽
          pic_height:res.data.pic_height, //报警高  
  
        }
        this.setState({
          data:data,
          prev:res.data.last,
          next:res.data.next, 
      },()=>{
        this.draw();
      });
    })
  }

  onChange=(checked,text)=>{ //控制显示围界与对象
  	this.setState({
        [text]: checked,
    },()=>{
    	this.draw()
    });	
  }
  looknew=(text)=>{ //查看上下一条
    let faths=this.state.faths;
    faths.code=this.state[text];
  	this.setState({
  		field:true,
  		obj:true,
      faths:faths,
  		code:this.state[text]
    },()=>{
    	this.componentDidMount()
    });
  }
  draw = ()=>{ //画围界
  	let ele = document.getElementById("canvasobj");
    let area = ele.getContext("2d");


//开始
    var x0, y0, xw ,yh, i;
    post({url:"/api/alarm/getone_foradmin",data:Object.assign(this.state.faths,{passivecode:this.state.activecompcode})},(res)=>{
            console.log('res.data',res.data.finalresult1);
            for(i in res.data.finalresult1){
              console.log('第'+i+'个********x0',res.data.finalresult1[i].x);
              console.log('第'+i+'个********y0',res.data.finalresult1[i].y);
              console.log('第'+i+'个********x+w',res.data.finalresult1[i].x+res.data.finalresult1[i].w);
              console.log('第'+i+'个********y+h',res.data.finalresult1[i].y+res.data.finalresult1[i].h);

              x0=res.data.finalresult1[i].x;
              y0=res.data.finalresult1[i].y;
              xw=res.data.finalresult1[i].x+res.data.finalresult1[i].w;
              yh=res.data.finalresult1[i].y+res.data.finalresult1[i].h;

              console.log('第'+i+'个坐标', x0,y0,xw,yh);
            }
            
            ele.onclick=function(e){
              e=e? e:window.event;
                ex=e.clientX-ele.offsetLeft;
                ey=e.clientY-ele.offsetTop;
                if(ex > x0 && ex< xw && ey > y0 && ey<yh){
                  console.log('选中了',ex,ey,x0,xw,y0,yh);
                }
                console.log('坐标','ex:'+ex,'ey:'+ey,'x0:'+x0,'xw:'+xw,'y0:'+y0,'yh:'+yh);
              }
          
            x0=res.data.finalresult1[0].x;
            y0=res.data.finalresult1[0].y;
            xw=res.data.finalresult1[0].x+res.data.finalresult1[0].w;
            yh=res.data.finalresult1[0].y+res.data.finalresult1[0].h;
       
        })
        //结束



    area.clearRect(0,0,704,576);//清除之前的绘图
    area.lineWidth=1;
    const datafield=this.state.data.field;
  	if(this.state.field && datafield.length){
      const xi=604/704, yi=476/576;
      let areafield = ele.getContext("2d"); 
      area.lineWidth=1;    
  		areafield.strokeStyle='#f00';
        datafield.map((el,i)=>{
        areafield.beginPath();
        areafield.moveTo(parseInt(datafield[i][0][0]*xi),parseInt(datafield[i][0][1]*yi));
        areafield.lineTo(parseInt(datafield[i][1][0]*xi),parseInt(datafield[i][1][1]*yi));
        areafield.lineTo(parseInt(datafield[i][2][0]*xi),parseInt(datafield[i][2][1]*yi));
        areafield.lineTo(parseInt(datafield[i][3][0]*xi),parseInt(datafield[i][3][1]*yi));
        areafield.lineTo(parseInt(datafield[i][0][0]*xi),parseInt(datafield[i][0][1]*yi));
        areafield.stroke();
        areafield.closePath();
        return '';
      })
  	}
    const objs=this.state.data.finalresult;
  	if(this.state.obj && objs.length){
      //计算缩放比例
      const x=604/this.state.data.pic_width, y=476/this.state.data.pic_height;
      objs.map((el,i)=>{
        area.strokeStyle='#ff0';
        area.beginPath();
        area.rect(parseInt(el.x*x),parseInt(el.y*y),parseInt(el.w*x),parseInt(el.h*y));
        area.stroke();
        area.closePath();
        return '';
      })
  		
  	}
  }
    render(){      
        return(
            <div className="alarmDetails">
            {/* <Popconfirm title="确认为误报吗？" okText="确认" cancelText="取消">
              <a href="#"  onClick={()=>this.wubao('w')}>222222222222222222</a>
            </Popconfirm> */}
            	<div className="alarmflex">
            		<div className="flexleft" id="flexleft">
            			<canvas id="canvasobj" width="604px" height="476px" style={{backgroundImage:'url('+this.state.data.src+')',backgroundSize:"100% 100%"}} />
            			<div style={{textAlign:'center'}}>
            				<ButtonGroup>
      							  <Button type="primary" onClick={()=>this.looknew('prev')} disabled={this.state.prev?false:true}>
      								<Icon type="left" />上一条
      							  </Button>&nbsp;&nbsp;&nbsp;
      							  <Button type="primary" onClick={()=>this.looknew('next')} disabled={this.state.next?false:true}>
      								下一条<Icon type="right" />
      							  </Button>
      							</ButtonGroup> 
            			</div>
            		</div>	
            		<div className="flexright">
            				<h4><b>{this.state.data.name}</b></h4>
            				<p><label>报警对象：<span>{this.state.data.tags}</span></label></p>
            				<p><label>围界信息: <Switch size="small" checked={this.state.field} onChange={(checked)=>this.onChange(checked,'field')} /></label></p>
            				<p><label>报警信息: <Switch size="small" checked={this.state.obj} onChange={(checked)=>this.onChange(checked,'obj')} /></label></p>
            				<p><label>报警时间：<span>{this.state.data.atime}</span></label></p>
            		</div>
            	</div>
            </div>
        )
    }
}
export default Alarmdetails
