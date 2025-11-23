import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { User, Resume, ResumeContent, Template, ApiResponse } from '@/types';
import { message } from 'antd';

// Auth API calls
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; name?: string }) => {
      const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      message.success('Registration successful!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/login', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      message.success('Login successful!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      message.success('Logged out successfully');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<{ user: User }>>('/api/auth/me');
        return response.data.data?.user || null;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });
};

// Resume API calls
export const useResumes = () => {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ resumes: Resume[] }>>('/api/resume');
      return response.data.data?.resumes || [];
    },
  });
};

export const useResume = (id: number | string) => {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ resume: Resume }>>(`/api/resume/${id}`);
      return response.data.data?.resume || null;
    },
    enabled: !!id,
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; template: string; content: ResumeContent }) => {
      const response = await api.post<ApiResponse<{ resume: Resume }>>('/api/resume', data);
      return response.data.data?.resume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      message.success('Resume created successfully!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create resume');
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; template: string; content: ResumeContent } }) => {
      const response = await api.put<ApiResponse<{ resume: Resume }>>(`/api/resume/${id}`, data);
      return response.data.data?.resume;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', variables.id] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/resume/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      message.success('Resume deleted successfully!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete resume');
    },
  });
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ templates: Template[] }>>('/api/resume/templates/list');
      return response.data.data?.templates || [];
    },
  });
};

export const useExportPDF = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/resume/${id}/export/pdf`, {}, {
        responseType: 'blob',
      });
      return response.data;
    },
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('PDF downloaded successfully!');
    },
    onError: (error: any) => {
      message.error('Failed to export PDF');
    },
  });
};
