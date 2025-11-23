'use client';

import { Layout, Button, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useCurrentUser, useLogout } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const { Header } = Layout;

export default function Navbar() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push('/login');
  };

  const userMenuItems = [
    {
      key: 'email',
      label: user?.email,
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
      }}
    >
      <Link href="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <Image
            src="/310830-P8R3OL-35.jpg"
            alt="Resume Builder Logo"
            width={50}
            height={50}
            style={{ objectFit: 'contain' }}
          />
          <span style={{ fontSize: '20px', fontWeight: 600, color: '#1677ff' }}>
            Resume Builder
          </span>
        </div>
      </Link>

      {!isLoading && (
        <Space>
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button icon={<UserOutlined />} type="text">
                {user.name || 'Profile'}
              </Button>
            </Dropdown>
          ) : (
            <>
              <Link href="/login">
                <Button type="text">Login</Button>
              </Link>
              <Link href="/register">
                <Button type="primary">Sign Up</Button>
              </Link>
            </>
          )}
        </Space>
      )}
    </Header>
  );
}
