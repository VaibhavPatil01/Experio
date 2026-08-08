import User from '../../../models/User.js';
import ResumeAnalysisRetrievalService from './ResumeAnalysisRetrievalService.js';
import logger from '../../../utils/logger.js';

export default class ResumeAnalysisContextBuilder {
  /**
   * Orchestrates gathering all necessary context for the Resume Analyzer.
   * Returns a strongly typed JSON object instead of a pre-formatted string.
   * 
   * @param {string} userId
   * @param {string} targetRole
   * @param {string} targetCompany
   * @param {string} jobDescription
   * @param {string} resumeText
   * @returns {Promise<Object>} The strongly structured context object
   */
  static buildContext(userId, targetRole, targetCompany, jobDescription, resumeText, userProfile, relevantExperiences) {
    try {
      const startTime = performance.now();
      
      const candidateFacts = {
        resumeText: resumeText || '',
        profile: userProfile || {}
      };
      
      const targetFacts = {
        role: targetRole || '',
        company: targetCompany || '',
        jobDescription: jobDescription || ''
      };
      
      const durationMs = Math.round(performance.now() - startTime);
      logger.info('Context preparation completed', { userId, durationMs });

      return {
        metadata: {
          priority: ["resume", "target", "profile", "platform"],
          userId: userId,
          durationMs
        },
        candidateFacts: candidateFacts,
        targetFacts: targetFacts,
        platformFacts: relevantExperiences
      };
    } catch (error) {
      logger.error('Failed to build context for Resume Analyzer', { error: error.message });
      throw error;
    }
  }

  /**
   * Retrieves the user's existing profile data and carefully selects/normalizes useful fields.
   * This is exported so the Orchestrator can call it concurrently with other operations.
   */
  static async buildUserProfileContext(userId) {
    const user = await User.findById(userId).lean();
    if (!user) {
      logger.warn(`ContextBuilder: User not found for ID ${userId}`);
      return {};
    }

    const safeTruncate = (str, maxLength) => {
      if (!str) return '';
      return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    };

    // Construct a clean, token-conscious profile object
    const profile = {
      overallExperience: `${user.experienceYears || 0} years, ${user.experienceMonths || 0} months`,
      education: (user.education || []).map(e => ({
        qualification: e.qualification,
        university: e.university,
        year: e.passingYear
      })),
      skills: user.skills || [],
      workExperience: (user.workExperiences || []).map(w => ({
        jobTitle: w.jobTitle,
        company: w.company,
        duration: `${w.startMonth || ''} ${w.startYear || ''}`,
        description: safeTruncate(w.description, 400) // Truncate long descriptions
      })),
      projects: (user.projects || []).map(p => ({
        title: p.title,
        description: safeTruncate(p.description, 400)
      }))
    };

    // Remove empty arrays to save space
    if (profile.education.length === 0) delete profile.education;
    if (profile.skills.length === 0) delete profile.skills;
    if (profile.workExperience.length === 0) delete profile.workExperience;
    if (profile.projects.length === 0) delete profile.projects;

    return profile;
  }

}
