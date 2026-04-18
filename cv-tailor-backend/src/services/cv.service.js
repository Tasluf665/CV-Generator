const { SECTION_LIMITS } = require('../utils/constants');

const validateSectionLength = (text, section) => {
  const limit = SECTION_LIMITS[section];
  return text.length <= limit;
};

module.exports = {
  validateSectionLength,
};
