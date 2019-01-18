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
    }

    render() {
        const columns = [{
            title: '',
            dataIndex: 'name',
          }, {
            title: 'GPU二次',
            dataIndex: 'gpu',
          }, {
            title: 'small pic',
            dataIndex: 'pic',
          }, {
            title: 'Web',
            dataIndex: 'web',
          }, {
            title: '通讯rasp',
            dataIndex: 'rasp',
          }];
          const data = [{
            key: '1',
            name: '服务名称',
            gpu: '',
            pic: '',
            web:'',
            rasp:'',
          }, {
            key: '2',
            name: '当前状态',
            gpu: '',
            pic: '',
            web:'',
            rasp:'',
          }, {
            key: '3',
            name: '最后一次信息',
            gpu: 32,
            pic: '',
            web:'',
            rasp:'',
          }, {
            key: '3',
            name: '最后一次时间',
            gpu: '',
            pic: '',
            web:'',
            rasp:'111',
          }];
        return (
            <div className="ServerInfo">
                <BreadcrumbCustom first="服务器状态" />
                <Card className=""
                    title="服务器状态"
                    // extra={<a href="#">More</a>}
                    
                >
                   <div className="serve_list">
                      <Row>
                        <Col span={8} className="serve_item" >
                           <div className="serve_type"><div className="circle"></div> Web</div>
                           <div className="serve_item_b"  >
                                <div> 
                                    <Progress type="circle" percent={75} />
                                    <div className="it_text">空闲硬盘</div>
                                </div>
                                <div>
                                        <Progress type="circle" percent={30} status="exception" />
                                        <div className="it_text">内存</div>
                                </div>
                           </div>
                           
                        </Col>
                        <div className="serve_row"></div>
                        <Col span={7} className="serve_item">
                          <div className="serve_type"> <div className="circle"></div> FTP</div>
                           <div className="serve_item_b"  >
                                <div> 
                                    <Progress type="circle" percent={75} />
                                    <div className="it_text">空闲硬盘</div>
                                </div>
                                <div>
                                        <Progress type="circle" percent={30} status="exception" />
                                        <div className="it_text">内存</div>
                                </div>
                           </div>
                        </Col>
                        <div className="serve_row"></div>
                        <Col span={8} className="serve_item">
                           <div className="serve_type"><div className="circle"></div>GPU</div>
                            <div className="serve_item_b"  >
                                <div> 
                                    <Progress type="circle" percent={75} />
                                    <div className="it_text">空闲硬盘</div>
                                </div>
                                <div>
                                        <Progress type="circle" percent={30} status="exception" />
                                        <div className="it_text">内存</div>
                                </div>
                           </div>
                        </Col>
                      </Row>
                   </div>
                 </Card>








                 <div className="serve_state">
                    <Card className=""
                    title="服务器状态"
                    >
                        <div className="">
                            <Table columns={columns} dataSource={data} size="middle" />
                        </div>
                    </Card>

                 </div>
            </div>
        )
    }
}

export default ServerInfo;