import { openRouterClient } from '../../config/openrouter.js';
import { ApiError } from '../../utils/ApiError.js';
import { ENV } from '../../config/env.js';
import { getJobParserSystemPrompt } from '../../utils/promptBuilder.js';

/**
 * Service to parse raw job descriptions into structured data using AI
 */
export const parseJobDescription = async (rawDescription) => {
  if (!rawDescription || rawDescription.trim().length < 10) {
    throw new ApiError(400, 'Job description is too short to parse.');
  }

  try {
    const response = await openRouterClient.chat(
      [
        { role: 'system', content: getJobParserSystemPrompt() },
        { role: 'user', content: `Parse this job description:\n\n${rawDescription}` },
      ],
      {
        model: ENV.OPENROUTER_AI_MODEL, // Fast and reliable for extraction
        json: true,
      }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ApiError(500, 'Failed to get a response from AI parser.');
    }

    try {
      const parsed = JSON.parse(content);

      return {
        summary: typeof parsed?.summary === 'string' ? parsed.summary : '',
        requirements: Array.isArray(parsed?.requirements) ? parsed.requirements : [],
        responsibilities: Array.isArray(parsed?.responsibilities) ? parsed.responsibilities : [],
        extractedKeywords: Array.isArray(parsed?.extractedKeywords) ? parsed.extractedKeywords : [],
      };
    } catch (parseError) {
      console.error('AI JSON Parse Error:', content);
      throw new ApiError(500, 'AI returned invalid JSON format.');
    }
  } catch (error) {
    console.error('Job Parser Service Error:', error);
    throw new ApiError(error.statusCode || 500, error.message || 'AI parsing failed.');
  }
};
