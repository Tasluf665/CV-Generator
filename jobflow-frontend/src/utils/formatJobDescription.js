export const formatJobDescription = (value = '') => {
    if (!value) return '';

    const normalized = value
        .replace(/\r\n/g, '\n')
        .replace(/\u00a0/g, ' ')
        .trim();

    if (normalized.includes('\n')) {
        return normalized
            .replace(/\n\s*([•·*-])\s*/g, '\n• ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    return normalized
        .replace(/\s*([•·*-])\s+/g, '\n• ')
        .replace(/\s*(\d+)\.\s+/g, '\n$1. ')
        .replace(/\s+(?=\d+\.\s+)/g, '\n')
        .replace(/([.?!])\s+(?=[A-Z0-9(])/g, '$1\n\n')
        .replace(/;\s+(?=[A-Z0-9(])/g, ';\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};
