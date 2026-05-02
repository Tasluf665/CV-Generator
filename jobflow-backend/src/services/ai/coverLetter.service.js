import { openRouterClient } from '../../config/openrouter.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildCoverLetterPrompt } from '../../utils/promptBuilder.js';

/**
 * Generate a cover letter using AI
 * @param {Object} params
 * @param {Object} params.resumeData - The resume data to use
 * @param {string} params.jobDescription - The job description to tailor the letter to
 * @param {string} params.tone - The tone of the letter (Professional, Friendly, etc.)
 * @param {string} params.length - The length of the letter (Short, Standard, Detailed)
 * @returns {Promise<string>} The generated cover letter content
 */
export const generateCoverLetter = async ({
  resumeData,
  jobDescription,
  tone = 'Professional',
  length = 'Detailed',
  userPrompt = null,
}) => {
  try {
    const basePrompt = buildCoverLetterPrompt(resumeData, jobDescription, tone, length);
    const prompt = userPrompt
      ? `User Instructions: ${userPrompt}\n\n${basePrompt}`
      : basePrompt;

    const response = await openRouterClient.chat(
      [
        {
          role: 'system',
          content: 'You are a professional cover letter generator. Output only the letter text.',
        },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.5 }
    );

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new ApiError(500, 'AI failed to generate cover letter content');
    }

    return content.trim();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `AI Service Error: ${error.message}`);
  }
};
