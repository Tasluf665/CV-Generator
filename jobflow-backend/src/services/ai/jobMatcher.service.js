/**
 * Matches a resume against a job description using direct keyword comparison.
 * @param {Object} resumeKeywords - The extracted resume keywords
 * @param {Object} jobKeywords - The extracted job keywords
 * @param {string[]} [hiddenKeywordsList=[]] - Keywords in the resume but hidden (isVisible: false)
 * @returns {Promise<Object>} - The match results
 */
export const matchResumeWithJob = async (resumeKeywords, jobKeywords, hiddenKeywordsList = []) => {
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

  // Normalise hidden keywords to lowercase for comparison
  const hiddenSet = new Set(hiddenKeywordsList.map(k => k.toLowerCase()));

  const matchedKeywords = [];
  const missingKeywords = [];
  const hiddenKeywords = [];

  for (const jobKeyword of allJobKeywords) {
    const lowerJobKeyword = jobKeyword.toLowerCase();

    if (hiddenSet.has(lowerJobKeyword)) {
      // Skill is in the resume but hidden (unchecked) — yellow bucket
      hiddenKeywords.push(jobKeyword);
    } else {
      const isMatched = allResumeKeywords.some(resumeKw => resumeKw === lowerJobKeyword);
      if (isMatched) {
        matchedKeywords.push(jobKeyword);
      } else {
        missingKeywords.push(jobKeyword);
      }
    }
  }

  // Hidden keywords do NOT count toward the match score
  const scorableDenominator = allJobKeywords.length - hiddenKeywords.length;
  const matchScore = scorableDenominator > 0
    ? Math.round((matchedKeywords.length / scorableDenominator) * 100)
    : 0;

  return {
    matchScore,
    matchedKeywords,
    missingKeywords,
    hiddenKeywords,
    suggestions: []
  };
};
