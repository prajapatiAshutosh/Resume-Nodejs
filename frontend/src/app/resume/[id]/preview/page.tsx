'use client';

import { Layout, Button, Space, Spin } from 'antd';
import { EditOutlined, DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { useResume, useCurrentUser, useExportPDF } from '@/lib/hooks';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

const { Content } = Layout;

export default function ResumePreview() {
  const params = useParams();
  const resumeId = params.id as string;
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: resume, isLoading: resumeLoading } = useResume(resumeId);
  const exportPDF = useExportPDF();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleEdit = () => {
    router.push(`/resume/${resumeId}`);
  };

  const handleExport = async () => {
    await exportPDF.mutateAsync(parseInt(resumeId));
  };

  const handleBack = () => {
    router.push('/dashboard');
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

  const renderContact = () => {
    const { contact } = resume.content;
    if (!contact) return null;

    const contactParts = [];
    if (contact.email) contactParts.push(contact.email);
    if (contact.phone) contactParts.push(contact.phone);
    if (contact.linkedin) contactParts.push(contact.linkedin);
    if (contact.website) contactParts.push(contact.website);

    return (
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{contact.name || 'Your Name'}</h1>
        <div style={{ color: '#666' }}>{contactParts.join(' | ')}</div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!resume.content.summary) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
          Professional Summary
        </h2>
        <div dangerouslySetInnerHTML={{ __html: resume.content.summary }} />
      </div>
    );
  };

  const renderExperience = () => {
    if (!resume.content.experience || resume.content.experience.length === 0) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
          Experience
        </h2>
        {resume.content.experience.map((exp, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div>
                <strong style={{ fontSize: '16px' }}>{exp.title}</strong>
                <div style={{ fontStyle: 'italic', color: '#555' }}>{exp.company}</div>
              </div>
              <div style={{ color: '#666' }}>
                {exp.from} - {exp.to}
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: exp.html }} />
          </div>
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (!resume.content.education || resume.content.education.length === 0) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
          Education
        </h2>
        {resume.content.education.map((edu, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div>
                <strong style={{ fontSize: '16px' }}>{edu.degree}</strong>
                <div style={{ fontStyle: 'italic', color: '#555' }}>{edu.institution}</div>
              </div>
              <div style={{ color: '#666' }}>
                {edu.from} - {edu.to}
              </div>
            </div>
            {edu.html && <div dangerouslySetInnerHTML={{ __html: edu.html }} />}
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!resume.content.projects || resume.content.projects.length === 0) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
          Projects
        </h2>
        {resume.content.projects.map((project, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <strong style={{ fontSize: '16px' }}>{project.name}</strong>
            {project.description && <div style={{ color: '#555' }}>{project.description}</div>}
            {project.html && <div dangerouslySetInnerHTML={{ __html: project.html }} />}
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (!resume.content.skills || resume.content.skills.length === 0) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
          Skills
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {resume.content.skills.map((skill, index) => (
            <span
              key={index}
              style={{
                background: '#f4f4f4',
                padding: '8px 15px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back to Dashboard
            </Button>
            <Space>
              <Button icon={<EditOutlined />} onClick={handleEdit}>
                Edit Resume
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} loading={exportPDF.isPending}>
                Export PDF
              </Button>
            </Space>
          </div>

          <div
            style={{
              background: '#fff',
              padding: '60px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              fontFamily: "'Georgia', serif",
              lineHeight: '1.6',
            }}
          >
            {renderContact()}
            {renderSummary()}
            {renderExperience()}
            {renderEducation()}
            {renderProjects()}
            {renderSkills()}
          </div>
        </div>
      </Content>
    </Layout>
  );
}
