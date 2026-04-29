import { openRouterClient } from '../../config/openrouter.js';
import { buildResumeAnalysisPrompt } from '../../utils/promptBuilder.js';

/**
 * Analyzes a resume using AI to provide a score and critique.
 * @param {Object} resumeData - The full resume object from database
 * @returns {Promise<Object>} - The analysis results { score, issues }
 */
export const analyzeResume = async (resumeData) => {
  const messages = [
    {
      role: 'system',
      content: `You are an expert Resume Reviewer and Applicant Tracking System (ATS) Specialist. 
Your goal is to analyze a resume and provide a detailed critique, identifying errors, warnings, and areas for improvement.
You must return your response in valid JSON format.`,
    },
    {
      role: 'user',
      content: buildResumeAnalysisPrompt(resumeData),
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

/**
 * Generates ATS keywords from a resume using AI.
 * @param {Object} resumeData - The full resume object from database
 * @returns {Promise<Object>} - The extracted keywords categorised
 */
export const generateResumeKeywords = async (resumeData) => {
  const { getResumeKeywordGeneratorSystemPrompt } = await import('../../utils/promptBuilder.js');
  
  const messages = [
    {
      role: 'system',
      content: getResumeKeywordGeneratorSystemPrompt(),
    },
    {
      role: 'user',
      content: `RESUME DATA (analyze this):\n\n${JSON.stringify(resumeData, null, 2)}`,
    },
  ];

  const response = await openRouterClient.chat(messages, { json: true });

  try {
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from AI keyword generator.');
    
    const parsed = JSON.parse(content);
    const keywordsObj = parsed?.extractedKeywords || {};
    return {
      'Hard Skills': Array.isArray(keywordsObj['Hard Skills']) ? keywordsObj['Hard Skills'] : [],
      'Soft Skills': Array.isArray(keywordsObj['Soft Skills']) ? keywordsObj['Soft Skills'] : [],
      'Others': Array.isArray(keywordsObj['Others']) ? keywordsObj['Others'] : [],
    };
  } catch (error) {
    console.error('AI Keyword JSON Parse Error:', error);
    throw new Error('AI returned invalid JSON format while generating resume keywords.');
  }
};

/**
 * Generates a bullet point for a specific position and keyword.
 */
export const generateBulletPoint = async (keyword, sectionType, positionData) => {
  const context = positionData 
    ? `Role: ${positionData.role || positionData.degree || positionData.name}\nCompany/Institution: ${positionData.company || positionData.school || ''}\nDescription: ${positionData.description || positionData.positionDescription || ''}`
    : 'General Resume Context';

  const messages = [
    {
      role: 'system',
      content: `You are an expert Resume Writer and Career Coach. 
Your task is to write a single, highly professional, impact-oriented resume bullet point.
The user will provide a specific skill/keyword they want to demonstrate, and context about the role they were in.
Write ONE bullet point (starting with a strong action verb, focusing on achievements/metrics if possible, and naturally incorporating the keyword).
Do NOT include any introduction, formatting, or bullet symbol (no '-' or '*'). Just the text.`,
    },
    {
      role: 'user',
      content: `Keyword to incorporate: "${keyword}"\nSection Type: ${sectionType}\n\nContext about the position:\n${context}\n\nPlease generate the single bullet point.`,
    },
  ];

  const response = await openRouterClient.chat(messages, { json: false });
  
  try {
    let bullet = response.choices[0]?.message?.content?.trim();
    if (!bullet) throw new Error('Empty response from AI bullet generator.');
    
    // Remove any leading bullet points/dashes the AI might have accidentally added
    bullet = bullet.replace(/^[-*•]\s*/, '');
    
    return bullet;
  } catch (error) {
    console.error('AI Bullet Generation Error:', error);
    throw new Error('Failed to generate bullet point.');
  }
};
