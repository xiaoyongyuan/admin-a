import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Card ,Row, Col,Progress,Table} from 'antd';
import '../../style/sjg/home.css';

  
class ServerInfo extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }
    componentDidMount() {        
        post({url:'/api/company/getsysinfo'},(res)=>{ //获取团队列表
            if(res){
                this.setState({
                    disk_all:res.sys.websys.disk_all,//web硬盘总容量
                    disk_use:res.sys.websys.disk_use,//web硬盘使用容量
                    memories_all:res.sys.websys.memories_all,//web内存总容量
                    memories_use:res.sys.websys.memories_use,//web内存使用容量
                    ftpdisk_use:res.sys.ftpsys.disk_use,//ftp硬盘使用容量
                    ftpdisk_all:res.sys.ftpsys.disk_all,//ftp硬盘总容量
                    ftpmemories_all:res.sys.ftpsys.memories_all,//ftp内存总容量
                    ftpmemories_use:res.sys.ftpsys.memories_use,//ftp内存使用容量
                    gpudisk_use:res.sys.gpusys.disk_use,//gpu硬盘使用容量
                    gpudisk_all:res.sys.gpusys.disk_all,//gpu硬盘总容量
                    gpumemories_all:res.sys.gpusys.memories_all,//gpu内存总容量
                    gpumemories_use:res.sys.gpusys.memories_use,//gpu内存使用容量
                    progressftp:res.sys.ftpsys,
                    progressgup:res.sys.gpusys,
                    tablelist:res.service,//服务器状态表格数据
                });
            }   
        })
    }

    render() {
        const columns = [{
            title: '服务器名称',
            dataIndex: 'name',
            key:"name"
          }, {
            title: '当前状态',
            dataIndex: 'laststatus',
            key:"laststatus"
          }, {
            title: '最后一次信息',
            dataIndex: 'lastinfo',
            key:"lastinfo"
          }, {
            title: '最后一次时间',
            dataIndex: 'lasttime',
            key:"lasttime"
          }];
        return (
            <div className="ServerInfo">
                <BreadcrumbCustom first="服务器信息" />
                <div className="firstcard">
                <Card 
                    title="服务器状态"
                >
                   <div className="serve_list">
                      <Row>
                        <Col span={8} className="serve_item" >
                           <div className="serve_type"><div className="circle"></div> WEB</div>
                           <div className="serve_item_b" >
                                <div className="progress_t"> 
                                    <Progress type="circle" 
                                        strokeColor={this.state.disk_use/this.state.disk_all<0.3?"red":""}
                                        percent={this.state.disk_use/this.state.disk_all*100}
                                    />
                                    <div className="it_text">空闲硬盘</div>
                                </div>
                                <div className="progress_t">
                                    <Progress type="circle"
                                        percent={this.state.memories_use/this.state.memories_all*100}
                                        strokeColor={this.state.memories_use/this.state.memories_all<0.3?"red":""}
                                    />
                                    <div className="it_text">内存</div>
                                </div>
                           </div>
                        </Col>
                        <div className="serve_row"></div>
                        <Col span={8} className="serve_item">
                          <div className="serve_type"> <div className="circle"></div> FTP</div>
                           <div className="serve_item_b">
                                <div className="progress_t"> 
                                    <Progress type="circle"
                                     percent={this.state.ftpdisk_use/this.state.ftpdisk_all*100}
                                     strokeColor={this.state.ftpdisk_use/this.state.ftpdisk_all<0.3?"red":""}
                                    />
                                    <div className="it_text">空闲硬盘</div>
                                </div>
                                <div className="progress_t">
                                    <Progress type="circle"
                                        percent={this.state.ftpmemories_use/this.state.ftpmemories_all*100}
                                        strokeColor={this.state.ftpmemories_use/this.state.ftpmemories_all<0.3?"red":""}
                                    />
                                    <div className="it_text">内存</div>
                                </div>
                           </div>
                        </Col>
                        <div className="serve_row"></div>
                        <Col span={7} className="serve_item">
                           <div className="serve_type"><div className="circle"></div>GPU</div>
                            <div className="serve_item_b"  >
                                <div className="progress_t"> 
                                    <Progress type="circle" 
                                        percent={this.state.gpudisk_use/this.state.gpudisk_all*100} 
                                        strokeColor={this.state.gpudisk_use/this.state.gpudisk_all<0.3?"red":""}
                                    />
                                    <div className="it_text">空闲硬盘</div>
                                </div>
                                <div className="progress_t">
                                    <Progress type="circle"
                                        percent={this.state.gpumemories_use/this.state.gpumemories_all*100} 
                                        strokeColor={this.state.gpumemories_use/this.state.gpumemories_all<0.3?"red":""}
                                    />
                                    <div className="it_text">内存</div>
                                </div>
                           </div>
                        </Col>
                      </Row>
                   </div>
                 </Card>
                 </div>
                 <div className="serve_state">
                    <Card className=""
                    title="服务器状态"
                    >
                        <div className="tabborder">
                            <Table columns={columns} dataSource={this.state.tablelist} size="middle" 
                             pagination={{hideOnSinglePage:true}}
                            />
                        </div>
                    </Card>

                 </div>
            </div>
        )
    }
}

export default ServerInfo;