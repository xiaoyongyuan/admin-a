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
      // area.clearRect(0,0,604,476);//清除之前的绘图
 

    console.log('2222',this.state.data.length);
    const objs=this.state.data;
  	if( objs.length>0){
      //计算缩放比例
      console.log('11111');
      const x=604/this.state.data.pic_width, y=476/this.state.data.pic_height;
      objs.map((el,i)=>{
        let fangquarr = []
        let finalareastring=el.finalarea;
        let zhuanhou= JSON.parse(finalareastring)
        fangquarr.push(zhuanhou); //属性
        console.log('fangquarr',fangquarr);
          fangquarr.map((item,j)=>{   
            console.log('/item*',item);
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
    console.log('dddd')
    const x=604/this.state.data.pic_width, y=476/this.state.data.pic_height;
    let ele = document.getElementById("canvasobj");
    let area = ele.getContext("2d");
    area.clearRect(0,0,604,476);//清除之前的绘图
    area.lineWidth=1;
    area.strokeStyle='#ff0';
    area.beginPath();
    area.rect(parseInt(el.x*x),parseInt(el.y*y),parseInt(el.w*x),parseInt(el.h*y));
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
    const finalresult=this.state.data.finalresult;
        if(finalresult.length){
          let getcord=this.getcoord(e); //获取点击的坐标
          const xi=604/this.state.data.pic_width, yi=476/this.state.data.pic_height;
          let x=parseInt(getcord[0]/xi),y=parseInt(getcord[1]/yi);
          const crut=this.selectObj(x,y);
          if(crut){
            console.log(crut);
            this.setState({crut})
            this.drawSelectObj(crut);
            this.openNotification();
          } 
          
        }
        
  }
  selectObj=(x,y)=>{
    var crut='';
    const finalresult=this.state.data.finalresult;
    finalresult.some((el,i)=>{
      if(el.x<=x && x<=(el.x+el.w) && el.y<=y && y<=(el.y+el.h) ){
        return crut=el;
      }
    })
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
                确认将此条报警对象置为误报？
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
  selectobjOk =(key)=>{ //误报提交
    const _this=this;
    const data={
      finalinfo:'',
      aid:_this.state.code,
      cid:_this.state.data.cid,
      finalarea:JSON.stringify(_this.state.crut),
      picpath:_this.state.data.src,
      pic_width:_this.state.data.pic_width,
      pic_height:_this.state.data.pic_height
    }
     post({url:"/api/Misinformation/add",data:data},(res)=>{
      if(res.success){
        notification.close(key);
        message.success('操作成功');
        _this.draw();
      }
     })
    
  }
  selectobjCancel =(key)=>{ //误报确认取消
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
