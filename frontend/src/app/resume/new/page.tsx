'use client';

import { Layout, Form, Input, Button, Card, Typography } from 'antd';
import Navbar from '@/components/Navbar';
import TemplateSelector from '@/components/TemplateSelector';
import { useCreateResume, useCurrentUser } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ResumeContent } from '@/types';

const { Content } = Layout;
const { Title } = Typography;

const defaultContent: ResumeContent = {
  contact: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

export default function NewResume() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const createResume = useCreateResume();
  const router = useRouter();
  const [form] = Form.useForm();
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const onFinish = async (values: { title: string }) => {
    try {
      const resume = await createResume.mutateAsync({
        title: values.title,
        template: selectedTemplate,
        content: defaultContent,
      });

      if (resume) {
        router.push(`/resume/${resume.id}`);
      }
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card>
            <Title level={2} style={{ marginBottom: '30px' }}>
              Create New Resume
            </Title>

            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="title"
                label="Resume Title"
                rules={[{ required: true, message: 'Please enter a title for your resume!' }]}
              >
                <Input placeholder="e.g., Software Engineer Resume" />
              </Form.Item>

              <Form.Item label="Template">
                <TemplateSelector value={selectedTemplate} onChange={setSelectedTemplate} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={createResume.isPending}>
                  Create Resume
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
