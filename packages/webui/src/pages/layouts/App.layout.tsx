import React, {useEffect, useState} from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import {Avatar, Col, Layout, Menu, Popover, Row, Space} from "antd";
import {
    UserOutlined,
    FolderOutlined,
    HomeOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import './App.layout.css';
import {BaseService, LocalStorageService} from "../../services";
const {Header, Footer, Content, Sider} = Layout;

interface AppLayoutProps {
    isOrgAdmin: boolean;
}

function AppLayout (props: AppLayoutProps) {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [user, setUser] = useState({firstName:'', lastName:''});
    const navigate = useNavigate();
    const toggle = () => {
        setMenuCollapsed(!menuCollapsed);
    }
    useEffect(() => {
        BaseService.getAll('users',0,0)
            .then((response) => {
                if (response && response.statusCode === 200 && response.data){
                    setUser(response.data);
                }
            });
    },[]);
    const logout = () => {
        LocalStorageService.removeToken();
        navigate('/login');
    }
    const onMenuClick = (e: any) => {
        switch (e.key) {
            case 'home' : navigate('/app/home'); break;
            case 'files': navigate('/app/files/'); break;
        }
    }
    return (
        <React.Fragment>
            <Layout style={{minHeight: '100vh'}}>
                {
                    props.isOrgAdmin ?
                        <Sider collapsible collapsed={menuCollapsed} onCollapse={toggle}>
                            <div className={'logo'}></div>
                            <Menu theme={'dark'} mode={'inline'} defaultSelectedKeys={['home']} onClick={onMenuClick}>
                                <Menu.Item key="home" icon={<HomeOutlined />}>
                                    Home
                                </Menu.Item>
                            </Menu>
                        </Sider> : null
                }
                <Layout className={'site-layout'}>
                    <Header className={'site-layout-background '}>
                        <div className={'profile-image'}>
                            <Popover
                                content={<a onClick={logout}>Logout</a>}
                                title={`${user.firstName} ${user.lastName}`}
                                trigger={'click'} arrowPointAtCenter>
                                <Avatar>{user.firstName.charAt(0)+user.lastName.charAt(0)}</Avatar>
                            </Popover>
                        </div>
                    </Header>
                    <Content className={'site-layout-background '} style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280
                    }}><Outlet/></Content>
                    <Footer></Footer>
                </Layout>
            </Layout>
        </React.Fragment>
    );
}

export default AppLayout;
