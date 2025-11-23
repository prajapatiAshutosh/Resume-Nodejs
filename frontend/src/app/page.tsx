'use client';

import { Layout, Button, Typography, Space, Card, Row, Col } from 'antd';
import { EditOutlined, DownloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentUser } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  const features = [
    {
      icon: <EditOutlined style={{ fontSize: '32px', color: '#1677ff' }} />,
      title: 'Easy Editing',
      description: 'Intuitive editor with rich text formatting and section management',
    },
    {
      icon: (
        <Image
          src="/cv 150p-01.jpg"
          alt="Templates"
          width={32}
          height={32}
          style={{ objectFit: 'contain' }}
        />
      ),
      title: 'Multiple Templates',
      description: 'Choose from classic, modern, and minimal professional templates',
    },
    {
      icon: <DownloadOutlined style={{ fontSize: '32px', color: '#1677ff' }} />,
      title: 'PDF Export',
      description: 'Export your resume as a high-quality PDF with one click',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '32px', color: '#1677ff' }} />,
      title: 'Auto-save',
      description: 'Never lose your work with automatic saving every 10 seconds',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '0 50px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <Image
                src="/310830-P8R3OL-35.jpg"
                alt="Resume Builder Logo"
                width={120}
                height={120}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <Title level={1} style={{ fontSize: '48px', marginBottom: '24px' }}>
              Build Your Professional Resume
            </Title>
            <Paragraph style={{ fontSize: '20px', color: '#666', marginBottom: '40px' }}>
              Create, edit, and export beautiful resumes with ease
            </Paragraph>
            <Space size="large">
              {user ? (
                <Link href="/dashboard">
                  <Button type="primary" size="large" style={{ height: '50px', fontSize: '18px' }}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button type="primary" size="large" style={{ height: '50px', fontSize: '18px' }}>
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="large" style={{ height: '50px', fontSize: '18px' }}>
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </Space>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  style={{ textAlign: 'center', height: '100%' }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {feature.icon}
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph style={{ color: '#666', marginBottom: 0 }}>
                      {feature.description}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#fafafa' }}>
        Resume Builder 2024
      </Footer>
    </Layout>
  );
}
