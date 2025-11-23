'use client';

import { Layout, Button, Row, Col, Empty, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import ResumeListCard from '@/components/ResumeListCard';
import { useResumes, useCurrentUser } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: resumes, isLoading: resumesLoading } = useResumes();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleCreateNew = () => {
    router.push('/resume/new');
  };

  if (userLoading || resumesLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <Title level={2} style={{ margin: 0 }}>My Resumes</Title>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateNew}
            >
              Create New Resume
            </Button>
          </div>

          {resumes && resumes.length > 0 ? (
            <Row gutter={[24, 24]}>
              {resumes.map((resume) => (
                <Col xs={24} sm={12} lg={8} key={resume.id}>
                  <ResumeListCard resume={resume} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description="No resumes yet. Create your first one!"
              style={{ marginTop: '100px' }}
            >
              <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreateNew}>
                Create New Resume
              </Button>
            </Empty>
          )}
        </div>
      </Content>
    </Layout>
  );
}
