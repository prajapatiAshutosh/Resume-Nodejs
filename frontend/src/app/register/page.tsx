'use client';

import { Layout, Form, Input, Button, Card, Typography } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRegister, useCurrentUser } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { Content } = Layout;
const { Title } = Typography;

export default function Register() {
  const register = useRegister();
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const onFinish = async (values: { email: string; password: string; name?: string }) => {
    try {
      await register.mutateAsync(values);
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
            Create Your Account
          </Title>

          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="name"
              label="Name (Optional)"
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your name" />
            </Form.Item>

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
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={register.isPending}>
                Register
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              Already have an account? <Link href="/login">Login here</Link>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
