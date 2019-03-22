import React from 'react';
import {Button, Icon, message,notification } from 'antd';
import {post} from "../../axios/tools";
import "../../style/ztt/css/police.css";
let vis=false;
class Alarmdetails extends React.Component{
	constructor(props){
      super(props);
      this.state={
        ifblock:false,
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
      eid:this.props.toson.eid,
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
    this.setState({
      createby:"",
      createon:"",
      memo:"",
      ifblock:false,
      eid:this.props.toson.eid,
    })
     let ele = document.getElementById("canvasobj");
     let area = ele.getContext("2d");
     area.clearRect(0,0,604,476);//清除之前的绘图
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
  drawSelectObj=(el)=>{ //画出当前选中的围界
    let pel= JSON.parse(el.finalarea);
    const x=this.state.x, y=this.state.y;
    let ele = document.getElementById("canvasobj");
    let area = ele.getContext("2d");
    area.clearRect(0,0,604,476);//清除之前的绘图
    area.lineWidth=1;
    area.strokeStyle='#ff0';
    area.beginPath();
    area.rect(parseInt(pel.x*x),parseInt(pel.y*y),parseInt(pel.w*x),parseInt(pel.h*y));
    area.stroke();
    area.closePath();
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
             if(crut){
              this.openNotification();
              this.drawSelectObj(crut);
              this.setState({crut})
              this.setState({
                createby:crut.createby,
                createon:crut.createon,
                memo:crut.memo,
                ifblock:true,
                code:crut.code,
              })
             } 
        }
  }
  selectObj=(x,y)=>{
    const objssa=this.state.data;
    var crut='';
    for( var j=0; j<= objssa.length; j++){
     //点击是否在 objssa[j].finalarea
     let finalareastring=objssa[j]!==undefined?objssa[j].finalarea:'';
     let zhuanhou= JSON.parse(finalareastring);
      if(zhuanhou.x<=x && x<=(zhuanhou.x+zhuanhou.w) && zhuanhou.y<=y && y<=(zhuanhou.y+zhuanhou.h) ){
       return objssa[j]
      }
    }
    return crut;
  }
  openNotification = () => { //确认误报弹层
    const _this=this;
     const btn = (
        <div>
          <Button type="primary" size="small"  onClick={() => _this.selectobjOk('newalarm')}>确认</Button>
          <Button type="primary" size="small" onClick={() => _this.selectobjCancel('newalarm')}>取消</Button>
        </div>      
    );
      notification.open({
          key:'newalarm',
          message: '信息',
          description: (
            <div>
                确认将此条误报对象删除？
            </div>
        ),
        onClose:function(){
          _this.selectobjCancel()
        },
        btn,
        duration: 0,
        placement:'topLeft',
        left:100,
        top:300,
      });
  };
  selectobjOk =(key)=>{ //误报删除
    const _this=this;
    const data={
      code:this.state.code
    }
     post({url:"/api/misinformation/del",data:data},(res)=>{
      if(res.success){
        notification.close(key);
        message.success('删除成功');
        _this.draw();
        this.request();
      }
     })
  }
  selectobjCancel =(key)=>{ //误报删除取消
    this.setState({
      crut:{}
    },()=>{
      this.draw();
      notification.close(key);
    })
  }
    render(){      
        return(
            <div className="alarmDetails">
            	<div className="alarmflex">
            		<div className="flexleft" id="flexleft"style={{background:'#ccc'}}>
            			 <canvas id="canvasobj" width="604px" height="476px" onClick={this.clickgetcorrd} style={{backgroundImage:'url('+this.state.src+')',backgroundSize:"100% 100%",}} /> 
            		</div>	
            	 <div className="flexright">
                    <p><label>设备名称：<span>{this.state.eid}</span></label></p>
                    <p><label>误报数量：<span>{this.state.data.length}</span></label></p>
                    <div style={this.state.ifblock?{display:'block'}:{display:'none'}}>
                      <p><label>当前误报信息</label></p>
                      <p><label>创建人：<span>{this.state.createby}</span></label></p>
                      <p><label>报警对象：<span>{this.state.createon}</span></label></p>
                      <p><label>备注：<span>{this.state.memo}</span></label></p>
                    </div>
            		</div> 
            	</div>
            </div>
        )
    }
}
export default Alarmdetails
