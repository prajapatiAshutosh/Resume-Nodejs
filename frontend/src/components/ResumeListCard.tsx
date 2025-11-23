'use client';

import { Card, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Resume } from '@/types';
import { useRouter } from 'next/navigation';
import { useDeleteResume, useExportPDF } from '@/lib/hooks';

interface ResumeListCardProps {
  resume: Resume;
}

export default function ResumeListCard({ resume }: ResumeListCardProps) {
  const router = useRouter();
  const deleteResume = useDeleteResume();
  const exportPDF = useExportPDF();

  const handleEdit = () => {
    router.push(`/resume/${resume.id}`);
  };

  const handleDelete = async () => {
    await deleteResume.mutateAsync(resume.id);
  };

  const handleExport = async () => {
    await exportPDF.mutateAsync(resume.id);
  };

  const handlePreview = () => {
    router.push(`/resume/${resume.id}/preview`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card
      hoverable
      actions={[
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined />}
          onClick={handleEdit}
        >
          Edit
        </Button>,
        <Button
          key="preview"
          type="text"
          icon={<EyeOutlined />}
          onClick={handlePreview}
        >
          Preview
        </Button>,
        <Button
          key="download"
          type="text"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          loading={exportPDF.isPending}
        >
          Export
        </Button>,
        <Popconfirm
          key="delete"
          title="Delete resume"
          description="Are you sure you want to delete this resume?"
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deleteResume.isPending}
          >
            Delete
          </Button>
        </Popconfirm>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ fontSize: '18px', fontWeight: 600 }}>{resume.title}</div>
        <Tag color="blue">{resume.template}</Tag>
        <div style={{ fontSize: '13px', color: '#666' }}>
          Last updated: {formatDate(resume.updatedAt)}
        </div>
      </Space>
    </Card>
  );
}
