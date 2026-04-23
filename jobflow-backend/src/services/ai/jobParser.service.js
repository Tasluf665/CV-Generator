import { openRouterClient } from '../../config/openrouter.js';
import { ApiError } from '../../utils/ApiError.js';
import { ENV } from '../../config/env.js';

/**
 * Service to parse raw job descriptions into structured data using AI
 */
export const parseJobDescription = async (rawDescription) => {
  if (!rawDescription || rawDescription.trim().length < 10) {
    throw new ApiError(400, 'Job description is too short to parse.');
  }

  const systemPrompt = `
    You are an expert Job Data Parser. Your task is to extract structured information from a raw job description.
    Respond ONLY with a valid JSON object.
    
    The JSON structure should be:
    {
      "jobTitle": "Extracted job title",
      "company": "Extracted company name",
      "location": "Extracted location (City, State/Country)",
      "jobType": "One of: Full-time, Part-time, Contract, Internship, Freelance",
      "summary": "A concise 2-3 sentence summary of the role",
      "requirements": ["List of key requirements/skills"],
      "responsibilities": ["List of key responsibilities"],
      "extractedKeywords": ["Important keywords for SEO/matching"],
      "salaryRange": {
        "min": number or null,
        "max": number or null,
        "currency": "Currency code like USD, EUR"
      },
      "experienceLevel": "One of: Entry, Mid, Senior, Lead, Executive"
    }
    
    If any field is not found, use null for numbers or empty strings/arrays for strings/arrays.
  `;

  try {
    const response = await openRouterClient.chat(
      [
        { role: 'system', content: systemPrompt },
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
      return JSON.parse(content);
    } catch (parseError) {
      console.error('AI JSON Parse Error:', content);
      throw new ApiError(500, 'AI returned invalid JSON format.');
    }
  } catch (error) {
    console.error('Job Parser Service Error:', error);
    throw new ApiError(error.statusCode || 500, error.message || 'AI parsing failed.');
  }
};
