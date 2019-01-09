
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Table, DatePicker, Form, Input, Row, Col, Button} from 'antd';
import moment from 'moment';
import BreadcrumbCustom from "../BreadcrumbCustom";
const {RangePicker } = DatePicker;
const FormItem = Form.Item;


class Adminteam extends Component {
    render() {
        const dateFormat = 'YYYY/MM/DD';
        const columns = [
            {
                title: '序号',
                dataIndex: 'order',
                key: 'order'
            },
            {
                title: '名称',
                dataIndex: 'manage',
                key: 'manage'
            }, {
                title: '坐标',
                dataIndex: 'coordinate',
                key: 'coordinate',
                render: text => <span>{text}</span>,
            },
            {
                title: '类型',
                dataIndex: 'usertype',
                key: 'usertype',
                render: text => <span>{text}</span>,
            },
            {
                title: '用户数',
                dataIndex: 'usernum',
                key: 'usernum',
                render: text => <span>{text}</span>,
            },
            {
                title: '云服务到期日期',
                dataIndex: 'riqi',
                key: 'riqi',
                render: text => <span>{text}</span>,
            },
            {
                title: '说明',
                dataIndex: 'explain',
                key: 'explain',
                render: text => <span>{text}</span>,
            },
            {
                title: '共享',
                dataIndex: 'share',
                key: 'share',
                render: text => <span>{text}</span>,
            },
            {
                title: '操作',
                key: 'manage3',
                render: (text, record) => (
                    <span>
		            <Button>编辑</Button>
		            <span className="ant-divider" />
		            <Button>删除</Button>
		        </span>
                ),
            }];

        const data = [{
            key: '1',
            order:'1',
            manage: 'John Brown',
            coordinate:'西安',
            usertype:'树莓派',
            usernum:'3123',
            riqi:'2019.12.12',
            explain:'托管中',
            share:'查看',

        }, {
            key: '2',
            order:'2',
            manage: 'Jim Green',
            coordinate:'西安',
            usertype:'树莓派',
            usernum:'3123',
            riqi:'2019.12.12',
            explain:'托管中',
            share:'查看',

        }];
        return (
            <div>
                <BreadcrumbCustom first="账号管理" second="维护团队管理" />
                <Row className="margin_top80 margin_bottom40">
                    <Col span={18}>
                        <Form layout="inline">
                            <FormItem label="名称">
                                <Input />
                            </FormItem>
                            <FormItem label="云服务到期日期">
                                <RangePicker defaultValue={[moment('2018/01/01', dateFormat), moment('2018/02/01', dateFormat)]} format={dateFormat} />
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={4} offset={2}>
                        <Button type="primary" htmlType="submit">
                            新增
                        </Button>
                    </Col>
                </Row>

                <Table columns={columns} dataSource={data} />

            </div>
        )
    }
}

export default Adminteam;