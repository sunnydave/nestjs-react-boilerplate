import React from 'react';
import {Outlet} from "react-router-dom";
import {Layout} from "antd";
import './Auth.layout.css';
const {Header, Footer, Content} = Layout;


function AuthLayout () {
    return (
        <React.Fragment>
            <Layout>
                <Header>
                    <div className={'logo'}></div>
                </Header>
                <Content style={{padding: '0 50px'}}>
                    <div className={'site-layout-content'}><Outlet/></div>
                </Content>
                <Footer></Footer>
            </Layout>
        </React.Fragment>
    );
}

export default AuthLayout;
