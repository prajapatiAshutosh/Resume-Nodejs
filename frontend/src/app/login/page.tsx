'use client';

import { Layout, Form, Input, Button, Card, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useLogin, useCurrentUser } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { Content } = Layout;
const { Title } = Typography;

export default function Login() {
  const login = useLogin();
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login.mutateAsync(values);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
        <Card style={{ width: '100%', maxWidth: '450px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
            Login to Your Account
          </Title>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={login.isPending}>
                Login
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              Don't have an account? <Link href="/register">Register here</Link>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
