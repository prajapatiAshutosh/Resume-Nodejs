'use client';

import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Space } from 'antd';

interface AutosaveIndicatorProps {
  saving: boolean;
  lastSaved?: Date;
}

export default function AutosaveIndicator({ saving, lastSaved }: AutosaveIndicatorProps) {
  return (
    <Space style={{ fontSize: '13px', color: '#666' }}>
      {saving ? (
        <>
          <SyncOutlined spin />
          <span>Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span>
            Saved at {lastSaved.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </>
      ) : null}
    </Space>
  );
}
