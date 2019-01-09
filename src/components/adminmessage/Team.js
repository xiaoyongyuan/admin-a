import React, { Component } from 'react';
import {Table, DatePicker, Form, Input, Row, Col, Button} from 'antd';
import moment from 'moment';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;

class Team extends Component {
    render() {
    	const dateFormat = 'YYYY/MM/DD';
    	const columns = [{
		    title: '名称',
		    dataIndex: 'name',
		    key: 'name'
			},{
		    title: '用户类型',
		    dataIndex: 'name',
		    key: 'name',
		    render: text => <span>{text}</span>,
			},{
		    title: '设备数',
		    dataIndex: 'name',
		    key: 'name',
		    render: text => <span>{text}</span>,
			},{
		    title: '云服务到期日期',
		    dataIndex: 'name',
		    key: 'name',
		    render: text => <span>{text}</span>,
			},{
		    title: '共享',
		    dataIndex: 'name',
		    key: 'name',
		    render: text => <span>{text}</span>,
			}, {
		    title: '操作',
		    key: 'action',
		    render: (text, record) => (
		        <span>
		            <Button>编辑</Button>
		            <span className="ant-divider" />
		            <Button>共享</Button>
		        </span>
		    ),
		}];

		const data = [{
		    key: '1',
		    name: 'John Brown',
		    age: 32,
		    address: 'New York No. 1 Lake Park',
		}, {
		    key: '2',
		    name: 'Jim Green',
		    age: 42,
		    address: 'London No. 1 Lake Park',
		}];

        return (
          <div>
            <Row>
	            <Col span={18}>
	            	<Form layout="inline">
	                <FormItem label="名称">
	                  <Input />
	                </FormItem>               
									<FormItem label="入网日期">
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

export default Team;