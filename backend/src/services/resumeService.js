import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createResume = async (userId, { title, template, content }) => {
  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      template: template || 'classic',
      content,
    },
  });

  return resume;
};

export const getAllResumes = async (userId) => {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      template: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return resumes;
};

export const getResumeById = async (resumeId, userId) => {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new Error('Resume not found or unauthorized');
  }

  return resume;
};

export const updateResume = async (resumeId, userId, data) => {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new Error('Resume not found or unauthorized');
  }

  const updatedResume = await prisma.resume.update({
    where: { id: resumeId },
    data: {
      title: data.title,
      template: data.template,
      content: data.content,
    },
  });

  return updatedResume;
};

export const deleteResume = async (resumeId, userId) => {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new Error('Resume not found or unauthorized');
  }

  await prisma.resume.delete({
    where: { id: resumeId },
  });

  return true;
};
