/**
 * Matches a resume against a job description using direct keyword comparison.
 * @param {Object} resumeKeywords - The extracted resume keywords
 * @param {Object} jobKeywords - The extracted job keywords
 * @returns {Promise<Object>} - The match results
 */
export const matchResumeWithJob = async (resumeKeywords, jobKeywords) => {
  const allJobKeywords = [
    ...(jobKeywords['Hard Skills'] || []),
    ...(jobKeywords['Soft Skills'] || []),
    ...(jobKeywords['Others'] || []),
  ];

  const allResumeKeywords = [
    ...(resumeKeywords['Hard Skills'] || []),
    ...(resumeKeywords['Soft Skills'] || []),
    ...(resumeKeywords['Others'] || []),
  ].map(k => k.toLowerCase());

  const matchedKeywords = [];
  const missingKeywords = [];

  for (const jobKeyword of allJobKeywords) {
    const lowerJobKeyword = jobKeyword.toLowerCase();

    // A match occurs only if there is an exact case-insensitive match
    const isMatched = allResumeKeywords.some(resumeKw =>
      resumeKw === lowerJobKeyword
    );

    if (isMatched) {
      matchedKeywords.push(jobKeyword);
    } else {
      missingKeywords.push(jobKeyword);
    }
  }

  const matchScore = allJobKeywords.length > 0
    ? Math.round((matchedKeywords.length / allJobKeywords.length) * 100)
    : 0;

  return {
    matchScore,
    matchedKeywords,
    missingKeywords,
    suggestions: []
  };
};
