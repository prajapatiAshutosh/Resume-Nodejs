'use client';

import { Card, Radio, Space } from 'antd';
import { useTemplates } from '@/lib/hooks';

interface TemplateSelectorProps {
  value: string;
  onChange: (template: string) => void;
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const { data: templates, isLoading } = useTemplates();

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Select Template</h3>
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {templates?.map((template) => (
            <Card
              key={template.name}
              hoverable
              onClick={() => onChange(template.name)}
              style={{
                border: value === template.name ? '2px solid #1677ff' : '1px solid #d9d9d9',
              }}
            >
              <Radio value={template.name}>
                <Space direction="vertical">
                  <strong>{template.label}</strong>
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    {template.description}
                  </span>
                </Space>
              </Radio>
            </Card>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
}
