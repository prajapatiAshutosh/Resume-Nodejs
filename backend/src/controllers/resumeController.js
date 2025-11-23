import * as resumeService from '../services/resumeService.js';

export const createResume = async (req, res) => {
  try {
    const { title, template, content } = req.body;
    const userId = req.user.id;

    const resume = await resumeService.createResume(userId, {
      title,
      template,
      content,
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: { resume },
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create resume',
    });
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumes = await resumeService.getAllResumes(userId);

    res.status(200).json({
      success: true,
      data: { resumes },
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const userId = req.user.id;

    const resume = await resumeService.getResumeById(resumeId, userId);

    res.status(200).json({
      success: true,
      data: { resume },
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Resume not found',
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const userId = req.user.id;
    const { title, template, content } = req.body;

    const resume = await resumeService.updateResume(resumeId, userId, {
      title,
      template,
      content,
    });

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: { resume },
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update resume',
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const userId = req.user.id;

    await resumeService.deleteResume(resumeId, userId);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete resume',
    });
  }
};
