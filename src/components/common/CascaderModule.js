import React, { Component } from 'react';
import {Cascader} from "antd";
import {post} from "../../axios/tools";

const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  isLeaf: false,

}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  isLeaf: false,

}];

class CascaderModule extends Component {
    constructor(props){
        super(props);
        this.state={
           options
        };
    }
    componentDidMount() {
        this.getsData("/api/zonecode/gets_province",{},'province_id','province_name',true,1).then((res)=>{
          if(res) this.setState({options:res});
        })
    }
    getsData=(url,data,province_id,province_name,sub,grade)=>{
      const _this=this;
      return new Promise((resolve,reject)=>{
        post({url:url,data:data}, (res)=>{ //省
          if(res.success){
            resolve(_this.forEachData(res.data,province_id,province_name,sub,grade))
          }else reject(false)
        })
      })
      
    }
    formref = () => { //将form传给父组件由父组件控制表单提交
        return {
          zonecode:this.state.zonecode,
          usertype:this.state.usertype
        };
    };
    onChange = (value, selectedOptions) => {
      this.setState({
        zonecode:value[value.length-1],
        usertype:value.length-1
      })
    }
    loadData = (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true
      if(targetOption.grade==1){
        this.getsData("/api/zonecode/gets_city",{province_id:targetOption.value},'city_id','city_name',true,2).then((res)=>{
          if(res){
            targetOption.loading = false;
            targetOption.children=res;
            this.setState({
              options: [...this.state.options],
            });
          }
        })
      }else if(targetOption.grade==2){
        this.getsData("/api/zonecode/gets_county",{city_id:targetOption.value},'county_id','county_name',false,3).then((res)=>{
          if(res){
            targetOption.loading = false;
            targetOption.children=res;
            this.setState({
              options: [...this.state.options],
            });
          }
        })
      }

    }
    forEachData=(data,id,name,sub,grade)=>{
      var neaData=[]
      data.map((el,i)=>{
        var ex={
          label:el[name],
          value:el[id],
          grade
        }
        if(sub)ex.isLeaf=false
         neaData.push(ex) 
      })
      return neaData
    }
    render() {
        return (
            <div className="CascaderModule">
              <Cascader options={this.state.options}
              loadData={this.loadData}
              onChange={this.onChange}
              changeOnSelect />
            </div>
        )
    }
}

export default CascaderModule;