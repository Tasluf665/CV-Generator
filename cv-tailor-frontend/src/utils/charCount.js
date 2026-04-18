export const getCharCount = (text) => {
  return text ? text.trim().length : 0;
};

export const isExceedingLimit = (text, limit) => {
  return getCharCount(text) > limit;
};
