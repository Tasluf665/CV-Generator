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
You are a job description analyzer for a Job Tracking Dashboard. Your task is to parse the raw job description provided below and return a single, strictly formatted JSON object — no markdown, no explanation, no extra text outside the JSON.
---
## OUTPUT SCHEMA
Return ONLY this JSON structure:
{
  "summary": "<string>",
  "requirements": ["<string>", "..."],
  "responsibilities": ["<string>", "..."],
  "extractedKeywords": ["<string>", "..."]
}
---
## FIELD INSTRUCTIONS

### summary
Write 2–3 sentences covering: company or team context (if mentioned), the seniority level and role title, the main domain/industry, and the core purpose of this role. Keep it factual — do not editorialize.
### requirements
Extract all hard requirements: minimum years of experience, education level, certifications, licenses, and specific must-have skills or technologies. Use the exact terminology from the job description. Each requirement is one item in the array.
### responsibilities
Extract the core duties and ownership areas. Preserve the original action-verb phrasing (e.g., "Lead cross-functional teams" not "Leadership"). Each responsibility is one item in the array. Remove duplicate or near-duplicate bullets.
### extractedKeywords
This is the most critical field. These keywords will be used to optimize a CV for ATS (Applicant Tracking Systems).
---
## EXAMPLE
### Input (raw job description):
"We are looking for a Senior Data Engineer to join our growing Data Platform team at FinEdge. You will design and maintain scalable data pipelines using Apache Spark and dbt, and work closely with Data Scientists and analysts. Requirements: 5+ years of data engineering experience, proficiency in Python and SQL, experience with cloud platforms (AWS or GCP), familiarity with Airflow. Nice to have: Kafka, Terraform. You thrive in Agile teams and communicate clearly across departments."
### Expected Output:
{
  "summary": "FinEdge is hiring a Senior Data Engineer for their Data Platform team. The role focuses on designing and maintaining scalable data pipelines, working closely with Data Scientists and analysts. It requires strong cloud and pipeline engineering skills within an Agile environment.",
  "requirements": [
    "5+ years of data engineering experience",
    "Proficiency in Python and SQL",
    "Experience with cloud platforms (AWS or GCP)",
    "Familiarity with Apache Airflow",
    "Nice to have: Kafka, Terraform"
  ],
  "responsibilities": [
    "Design and maintain scalable data pipelines",
    "Work closely with Data Scientists and analysts",
    "Contribute to the Data Platform team infrastructure"
  ],
  "extractedKeywords": [
    "data engineering", "data pipelines", "Python", "SQL", "Apache Spark", "dbt", "AWS", "GCP", "Apache Airflow", "cloud platforms", "Kafka", "Terraform", "Agile", "data platform", "scalable pipelines", "Senior Data Engineer", "Data Scientist", "design", "maintain", "collaborate", "communicate"
  ]
}
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
