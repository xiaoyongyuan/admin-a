import React from 'react';
import {Button, Switch, Icon, notification, message } from 'antd';
import {post} from "../../axios/tools";
import "../../style/ztt/css/police.css";
let vis=false;
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

      	code:'', //当前数据的code
      };
  }
  componentWillMount() {
  	//此处拿到父页面参数
    this.setState({
      faths:this.props.toson,
      code:this.props.toson.code,
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
    const params=this.state.faths;
    post({url:"/api/misinformation/gets_misinfo",data:params},(res)=>{    
     
        this.setState({
          src:res.path,
          data:res.data,
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

  draw = ()=>{ //画围界
     let ele = document.getElementById("canvasobj");
     let area = ele.getContext("2d");
    const objs=this.state.data;
  	if( objs.length>0){
      //计算缩放比例
      objs.map((el,i)=>{
        this.setState({ x:604/el.pic_width,y:476/el.pic_height});	
        const x=604/el.pic_width, y=476/el.pic_height;
        let fangquarr = []
        let finalareastring=el.finalarea;
        let zhuanhou= JSON.parse(finalareastring)
        fangquarr.push(zhuanhou); //属性
          fangquarr.map((item,j)=>{   
            area.strokeStyle='#ff0';
            area.beginPath();
            area.rect(parseInt(item.x*x),parseInt(item.y*y),parseInt(item.w*x),parseInt(item.h*y));
            area.stroke();
            area.closePath();
            return ''; 
        })
      })
  	}
  }
  getcoord = (coords) => { //获取坐标
        let ele = document.getElementById("canvasobj");
        let canvsclent = ele.getBoundingClientRect();
        let x= coords.clientX - canvsclent.left * (ele.width / canvsclent.width);
        let y= coords.clientY - canvsclent.top * (ele.height / canvsclent.height)
        let pre=[x,y]
        return pre;
    }
  clickgetcorrd =(e)=>{ //点击
    e.preventDefault();
     const objss=this.state.data;
        if(objss.length>0){
            let getcord=this.getcoord(e); //获取点击的坐标
            let x=parseInt(getcord[0]/this.state.x),y=parseInt(getcord[1]/this.state.y);
            let crut=this.selectObj(x,y);
            console.log("crut2222",crut,x,y);
             if(crut){
               console.log("crut",crut);
               this.setState({crut})
               this.openNotification();
             } 
             console.log("objss",objss);
        }
  }
  selectObj=(x,y)=>{
    const objssa=this.state.data;
    var crut='';
    objssa.map((el,i)=>{
      let finalresult = []
      let finalareastring=el.finalarea;
      let zhuanhou= JSON.parse(finalareastring)
      finalresult.push(zhuanhou); 
       finalresult.some(
          (el,i)=>{
            if(el.x<=x && x<=(el.x+el.w) && el.y<=y && y<=(el.y+el.h) ){
              return crut=el;
            }
        }
      )
    })
    
    return crut;
  }

  openNotification = () => { //确认误报弹层

  };
    render(){      
        return(
            <div className="alarmDetails">
            	<div className="alarmflex">
            		<div className="flexleft" id="flexleft"style={{background:'#ccc'}}>
            			 <canvas id="canvasobj" width="604px" height="476px" onClick={this.clickgetcorrd} style={{backgroundImage:'url('+this.state.src+')',backgroundSize:"100% 100%",}} /> 
                  {/* <div className="mispic">
                       <img src={this.state.src} alt="误报图片" />
                  </div> */}
            		</div>	
            	 <div className="flexright">
            				<h4><b>{this.state.data.name}</b></h4>
            				<p><label>报警对象：<span>{this.state.data.tags}</span></label></p>
            		</div> 
            	</div>
            </div>
        )
    }
}
export default Alarmdetails
