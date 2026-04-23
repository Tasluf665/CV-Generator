import { openRouterClient } from '../../config/openrouter.js';

/**
 * Analyzes a resume using AI to provide a score and critique.
 * @param {Object} resumeData - The full resume object from database
 * @returns {Promise<Object>} - The analysis results { score, issues }
 */
export const analyzeResume = async (resumeData) => {
  const resumeText = JSON.stringify(resumeData, null, 2);

  const messages = [
    {
      role: 'system',
      content: `You are an expert Resume Reviewer and Applicant Tracking System (ATS) Specialist. 
Your goal is to analyze a resume and provide a detailed critique, identifying errors, warnings, and areas for improvement.
You must return your response in valid JSON format.`,
    },
    {
      role: 'user',
      content: `Analyze the following resume data and provide a professional score (0-100) and a list of specific issues (errors, warnings, or passes).
Focus on:
1. Contact information completeness.
2. Summary impact and clarity.
3. Work experience (action verbs, quantifiable results, formatting).
4. Skills relevance and categorization.
5. Education and certifications.

Resume Data:
${resumeText}

Return a JSON object with this structure:
{
  "score": number,
  "issues": [
    {
      "type": "error" | "warning" | "pass",
      "category": "Contact" | "Summary" | "Experience" | "Skills" | "Education" | "General",
      "title": "Short title of the issue",
      "description": "Detailed explanation and advice",
      "affectedSection": "Name of the section"
    }
  ]
}`,
    },
  ];

  const response = await openRouterClient.chat(messages, { json: true });
  
  try {
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    // If JSON parsing fails, attempt to extract JSON from the string
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI analysis response');
  }
};
