import { openRouterClient } from '../../config/openrouter.js';
import { ApiError } from '../../utils/ApiError.js';

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
  length = 'Standard',
}) => {
  try {
    const prompt = `
      You are an expert career coach. Generate a high-quality cover letter based on the following details:
      
      TONE: ${tone}
      LENGTH: ${length}
      
      RESUME DATA (JSON):
      ${JSON.stringify(resumeData)}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      INSTRUCTIONS:
      1. Tailor the cover letter specifically to the job description using the candidate's experience from the resume.
      2. Maintain the requested ${tone} tone.
      3. Aim for a ${length} length.
      4. Do not include placeholders like "[Your Name]" if the information is available in the resume.
      5. Use a professional layout with date, contact info (if available), and proper salutation.
      6. Return ONLY the final cover letter text. No preamble or conversational filler.
    `;

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
