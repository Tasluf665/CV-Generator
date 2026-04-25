/**
 * Utility to build prompts for different AI services
 */

/**
 * Builds the prompt for cover letter generation
 */
export const buildCoverLetterPrompt = (resumeData, jobDescription, tone, length) => {
  return `
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
};

/**
 * Builds the prompt for matching a resume with a job description
 */
export const buildJobMatchPrompt = (resumeData, jobData) => {
  const resumeText = JSON.stringify(resumeData, null, 2);
  const jobText = JSON.stringify(jobData, null, 2);

  return `Compare this resume with this job description.
      
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
}`;
};

/**
 * Builds the system prompt for job parsing
 */
export const getJobParserSystemPrompt = () => {
  return `
    You are an expert Job Data Parser. Your task is to extract ONLY analysis fields from a raw job description.
    Respond ONLY with a valid JSON object.
    
    The JSON structure should be:
    {
      "summary": "A concise 2-3 sentence summary of the role",
      "requirements": ["List of key requirements/skills"],
      "responsibilities": ["List of key responsibilities"],
      "extractedKeywords": ["Important keywords for SEO/matching"]
    }
    
    Rules:
    - Do NOT extract or infer job title, company, location, job type, salary, or experience level.
    - If any requested field is not found, use empty strings/arrays as appropriate.
  `;
};

/**
 * Builds the user prompt for resume analysis
 */
export const buildResumeAnalysisPrompt = (resumeData) => {
  const resumeText = JSON.stringify(resumeData, null, 2);

  return `Analyze the following resume data and provide a professional score (0-100) and a list of specific issues (errors, warnings, or passes).
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
}`;
};
