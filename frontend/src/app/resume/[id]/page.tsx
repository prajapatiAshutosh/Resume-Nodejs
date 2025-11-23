'use client';

import { Layout, Form, Input, Button, Space, Tabs, Spin, Card, Row, Col } from 'antd';
import { SaveOutlined, EyeOutlined, DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import AutosaveIndicator from '@/components/AutosaveIndicator';
import TemplateSelector from '@/components/TemplateSelector';
import { useResume, useUpdateResume, useCurrentUser, useExportPDF } from '@/lib/hooks';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ResumeContent } from '@/types';

const { Content } = Layout;
const { TextArea } = Input;

export default function ResumeEditor() {
  const params = useParams();
  const resumeId = params.id as string;
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: resume, isLoading: resumeLoading } = useResume(resumeId);
  const updateResume = useUpdateResume();
  const exportPDF = useExportPDF();
  const router = useRouter();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (resume) {
      form.setFieldsValue({
        title: resume.title,
        template: resume.template,
        content: resume.content,
      });
    }
  }, [resume, form]);

  const handleSave = useCallback(async () => {
    if (!resume || !hasChanges) return;

    try {
      setSaving(true);
      const values = form.getFieldsValue();
      await updateResume.mutateAsync({
        id: resume.id,
        data: {
          title: values.title,
          template: values.template,
          content: values.content,
        },
      });
      setLastSaved(new Date());
      setHasChanges(false);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  }, [resume, form, updateResume, hasChanges]);

  // Autosave every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChanges) {
        handleSave();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [handleSave, hasChanges]);

  const handleFormChange = () => {
    setHasChanges(true);
  };

  const handlePreview = () => {
    if (hasChanges) {
      handleSave();
    }
    router.push(`/resume/${resumeId}/preview`);
  };

  const handleExport = async () => {
    if (hasChanges) {
      await handleSave();
    }
    await exportPDF.mutateAsync(parseInt(resumeId));
  };

  if (userLoading || resumeLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!resume) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ padding: '50px' }}>
          <div>Resume not found</div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Space>
                <h2 style={{ margin: 0 }}>Edit Resume</h2>
                <AutosaveIndicator saving={saving} lastSaved={lastSaved} />
              </Space>
              <Space>
                <Button icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
                  Save Now
                </Button>
                <Button icon={<EyeOutlined />} onClick={handlePreview}>
                  Preview
                </Button>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} loading={exportPDF.isPending}>
                  Export PDF
                </Button>
              </Space>
            </div>

            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
            >
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: '1',
                    label: 'Basic Info',
                    children: (
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Form.Item name="title" label="Resume Title" rules={[{ required: true }]}>
                          <Input size="large" />
                        </Form.Item>

                        <Form.Item name="template" label="Template">
                          <TemplateSelector
                            value={form.getFieldValue('template')}
                            onChange={(template) => {
                              form.setFieldValue('template', template);
                              handleFormChange();
                            }}
                          />
                        </Form.Item>

                        <Card title="Contact Information" size="small">
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item name={['content', 'contact', 'name']} label="Full Name">
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name={['content', 'contact', 'email']} label="Email">
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name={['content', 'contact', 'phone']} label="Phone">
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name={['content', 'contact', 'linkedin']} label="LinkedIn">
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name={['content', 'contact', 'website']} label="Website">
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>

                        <Form.Item name={['content', 'summary']} label="Professional Summary">
                          <TextArea rows={6} placeholder="Write a brief summary about yourself..." />
                        </Form.Item>
                      </Space>
                    ),
                  },
                  {
                    key: '2',
                    label: 'Experience',
                    children: (
                      <Form.List name={['content', 'experience']}>
                        {(fields, { add, remove }) => (
                          <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {fields.map((field) => (
                              <Card
                                key={field.key}
                                size="small"
                                title={`Experience ${field.name + 1}`}
                                extra={
                                  <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(field.name)}
                                  >
                                    Remove
                                  </Button>
                                }
                              >
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item {...field} name={[field.name, 'title']} label="Job Title">
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item {...field} name={[field.name, 'company']} label="Company">
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item {...field} name={[field.name, 'from']} label="From">
                                      <Input placeholder="e.g., Jan 2020" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item {...field} name={[field.name, 'to']} label="To">
                                      <Input placeholder="e.g., Present" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item {...field} name={[field.name, 'html']} label="Description (HTML supported)">
                                      <TextArea rows={4} placeholder="<ul><li>Achievement 1</li><li>Achievement 2</li></ul>" />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Experience
                            </Button>
                          </Space>
                        )}
                      </Form.List>
                    ),
                  },
                  {
                    key: '3',
                    label: 'Education',
                    children: (
                      <Form.List name={['content', 'education']}>
                        {(fields, { add, remove }) => (
                          <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {fields.map((field) => (
                              <Card
                                key={field.key}
                                size="small"
                                title={`Education ${field.name + 1}`}
                                extra={
                                  <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(field.name)}
                                  >
                                    Remove
                                  </Button>
                                }
                              >
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item {...field} name={[field.name, 'degree']} label="Degree">
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item {...field} name={[field.name, 'institution']} label="Institution">
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item {...field} name={[field.name, 'from']} label="From">
                                      <Input placeholder="e.g., 2016" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item {...field} name={[field.name, 'to']} label="To">
                                      <Input placeholder="e.g., 2020" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item {...field} name={[field.name, 'html']} label="Additional Details (HTML supported)">
                                      <TextArea rows={3} placeholder="<p>GPA: 3.8/4.0</p>" />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Education
                            </Button>
                          </Space>
                        )}
                      </Form.List>
                    ),
                  },
                  {
                    key: '4',
                    label: 'Skills',
                    children: (
                      <Form.List name={['content', 'skills']}>
                        {(fields, { add, remove }) => (
                          <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {fields.map((field) => (
                              <Space key={field.key} style={{ display: 'flex' }}>
                                <Form.Item {...field} style={{ marginBottom: 0, flex: 1 }}>
                                  <Input placeholder="e.g., JavaScript, Python, React" />
                                </Form.Item>
                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                              </Space>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Skill
                            </Button>
                          </Space>
                        )}
                      </Form.List>
                    ),
                  },
                  {
                    key: '5',
                    label: 'Projects',
                    children: (
                      <Form.List name={['content', 'projects']}>
                        {(fields, { add, remove }) => (
                          <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {fields.map((field) => (
                              <Card
                                key={field.key}
                                size="small"
                                title={`Project ${field.name + 1}`}
                                extra={
                                  <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(field.name)}
                                  >
                                    Remove
                                  </Button>
                                }
                              >
                                <Row gutter={16}>
                                  <Col span={24}>
                                    <Form.Item {...field} name={[field.name, 'name']} label="Project Name">
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item {...field} name={[field.name, 'description']} label="Description">
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item {...field} name={[field.name, 'html']} label="Details (HTML supported)">
                                      <TextArea rows={4} placeholder="<ul><li>Feature 1</li><li>Feature 2</li></ul>" />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Project
                            </Button>
                          </Space>
                        )}
                      </Form.List>
                    ),
                  },
                ]}
              />
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
