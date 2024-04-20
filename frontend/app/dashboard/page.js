"use client";

import {  Layout, Tabs, Form, Input, Button } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, HistoryOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation"; 

const { TabPane } = Tabs;
const { Sider } = Layout;

export default function Dashboard() {
    const router = useRouter();

    // const handleTabClick = (key) => {
    //     switch (key) {
    //         case 'travel_history':
    //             router.push('/travel_history');
    //             break;
    //         case 'edit_account':
    //             router.push('/edit_account');
    //             break;
    //         case 'change_password':
    //             router.push('/change_password');
    //             break;
    //         default:
    //             break;
    //     }
    // };

    return (
        <Layout>
            <Sider width={2000} style={{ background: '#fff' }}>
                <Tabs >
                    <TabPane
                        tab={
                            <span>
                                < HistoryOutlined style={{ marginRight: 8 ,marginLeft: 8}} />
                                Bookings
                            </span>
                        }
                        key="travel_history"
                    >
                        Bookings
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <EditOutlined style={{ marginRight: 8 }}/>
                                Edit Profile
                            </span>
                        }
                        key="edit_account"
                    >
                        Edit Profile
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <LockOutlined style={{ marginRight: 8 }}/>
                                Change Password
                            </span>
                        }
                        key="change_password"
                    >
                      <Form
                    layout={"vertical"}
                    variant="filled"
                    style={{ maxWidth: 500, margin: "0 3rem" }}
                    //onFinish={onFormSubmit}
              >
                <Form.Item

                  label="Current Password"
                  name="curr_password"
                  rules={[{ required: true, message: "Please input!" }]}
                  style={{marginBottom: 10 , marginTop: 10,marginLeft: 10}}
                >
                <Input type="password" placeholder={"Password"} />
                </Form.Item>



                <Form.Item
                  label="New Password"
                  name="new_password"
                  rules={[{ required: true, message: "Please input!" }]}
                  style={{marginBottom: 10, marginLeft: 10}}
                >
                 <Input type="password" placeholder={"Password"} />
                </Form.Item>

                <Form.Item
                  label="Confirm New Password"
                  name="cnf_password"
                  rules={[{ required: true, message: "Please input!" }]}
                  style={{marginBottom: 10 , marginLeft: 10}}
                >
                 <Input type="password" placeholder={"Password"} />
                </Form.Item>


                <Form.Item wrapperCol={{ span: 16 }}>
                  <Button type="primary" htmlType="submit" style={{
                    marginLeft: 10,
                    marginTop: 10,
                  }}>
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
                      
                    </TabPane>
                </Tabs>
            </Sider>
        </Layout>
    );
}
