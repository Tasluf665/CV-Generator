import { openRouterClient } from '../../config/openrouter.js';

/**
 * Matches a resume against a job description using AI.
 * @param {Object} resumeData - The resume data
 * @param {Object} jobData - The job data (including JD)
 * @returns {Promise<Object>} - The match results
 */
export const matchResumeWithJob = async (resumeData, jobData) => {
  const resumeText = JSON.stringify(resumeData, null, 2);
  const jobText = JSON.stringify(jobData, null, 2);

  const messages = [
    {
      role: 'system',
      content: `You are an expert Talent Acquisition Manager. 
Your goal is to compare a candidate's resume against a specific job description and determine how well they match.
Identify keyword gaps, matched skills, and provide actionable suggestions to improve the match.
You must return your response in valid JSON format.`,
    },
    {
      role: 'user',
      content: `Compare this resume with this job description.
      
Job Description:
${jobText}

Resume:
${resumeText}

Return a JSON object with this structure:
{
  "matchScore": number (0-100),
  "matchedKeywords": [string],
  "missingKeywords": [string],
  "suggestions": [string]
}`,
    },
  ];

  const response = await openRouterClient.chat(messages, { json: true });

  try {
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI job match response');
  }
};
