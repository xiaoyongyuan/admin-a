/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchData, receiveData } from "@/action"; //action->index按需取
import bg from "../../style/imgs/bg.jpg";
import axios from "axios";

const FormItem = Form.Item;
class Login extends React.Component {
  componentWillMount() {
    const { receiveData } = this.props;
    receiveData(null, "auth");
  }
  componentDidUpdate(prevProps) {
    const { auth: nextAuth = {}, history } = this.props;
    if (nextAuth.data && nextAuth.data.success) {
      localStorage.setItem("admintoken", nextAuth.data.token);
      localStorage.setItem("adminuser", JSON.stringify(nextAuth.data.data));
      localStorage.setItem("admincomid", nextAuth.data.data.companycode);
      localStorage.setItem("adminaccount", nextAuth.data.data.account);
      history.push("/");
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    //在从此处登录，并记录下来
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //获取到的表单的值values
        const { fetchData } = this.props;
        fetchData({
          funcName: "webapp",
          url: "/login/verifyforadmin",
          params: values,
          stateName: "auth"
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login" style={{ backgroundImage: "url(" + bg + ")" }}>
        <div className="login-form">
          <div className="login-logo">
            <span>Login</span>
          </div>
          <Form onSubmit={this.handleSubmit} style={{ maxWidth: "300px" }}>
            <FormItem>
              {getFieldDecorator("account", {
                rules: [{ required: true, message: "请输入用户名!" }]
              })(
                <Input
                  prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                  placeholder="请输入用户名"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "请输入密码!" }]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                  type="password"
                  placeholder="请输入密码"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox>记住我</Checkbox>)}
              <span
                className="login-form-forgot"
                href=""
                style={{ float: "right" }}
              >
                忘记密码
              </span>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ width: "100%" }}
              >
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
        <div
          className="copyright"
          style={{
            position: "absolute",
            left: "44 %",
            bottom: "10px",
            fontSize: "12px",
            color: "#fff"
          }}
        >
          陕ICP备18019072号-1
        </div>
      </div>
    );
  }
}

const mapStateToPorps = state => {
  const { auth } = state.httpData;
  return { auth };
};
const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
  receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(
  mapStateToPorps,
  mapDispatchToProps
)(Form.create()(Login));

//第一个参数输入值，第二个输出。
//使用context取值
