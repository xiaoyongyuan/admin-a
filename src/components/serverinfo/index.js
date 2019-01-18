import React, { Component} from 'react';
import {post} from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";


class ServerInfo extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }
    componentDidMount() {
    }

    render() {

        return (
            <div className="ServerInfo">
                <BreadcrumbCustom first="报警统计"/>
            </div>
        )
    }
}

export default ServerInfo;