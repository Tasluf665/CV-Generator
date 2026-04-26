import { openRouterClient } from '../../config/openrouter.js';
import { ApiError } from '../../utils/ApiError.js';
import { ENV } from '../../config/env.js';
import { getJobParserSystemPrompt, getKeywordGeneratorSystemPrompt } from '../../utils/promptBuilder.js';

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
        { role: 'user', content: `RAW JOB DESCRIPTION (analyze this):\n\n${rawDescription}` },
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

/**
 * Generate ATS keywords from parsed job data
 */
export const generateJobKeywords = async ({ summary, requirements, responsibilities }) => {
  if (
    (typeof summary !== 'string' || summary.trim().length < 10) &&
    !Array.isArray(requirements) &&
    !Array.isArray(responsibilities)
  ) {
    throw new ApiError(400, 'Parsed job data is too short to generate keywords.');
  }

  const parsedJobData = {
    summary: typeof summary === 'string' ? summary : '',
    requirements: Array.isArray(requirements) ? requirements : [],
    responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
  };

  if (
    parsedJobData.summary.trim().length < 10 &&
    parsedJobData.requirements.length === 0 &&
    parsedJobData.responsibilities.length === 0
  ) {
    throw new ApiError(400, 'Parsed job data is too short to generate keywords.');
  }

  try {
    const response = await openRouterClient.chat(
      [
        { role: 'system', content: getKeywordGeneratorSystemPrompt() },
        {
          role: 'user',
          content: `PARSED JOB DATA (analyze this):\n\n${JSON.stringify(parsedJobData, null, 2)}`,
        },
      ],
      {
        model: ENV.OPENROUTER_AI_MODEL,
        json: true,
      }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ApiError(500, 'Failed to get a response from AI keyword generator.');
    }

    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed?.extractedKeywords) ? parsed.extractedKeywords : [];
    } catch (parseError) {
      console.error('AI Keyword JSON Parse Error:', content);
      throw new ApiError(500, 'AI returned invalid JSON format while generating keywords.');
    }
  } catch (error) {
    console.error('Job Keyword Service Error:', error);
    throw new ApiError(error.statusCode || 500, error.message || 'AI keyword generation failed.');
  }
};
