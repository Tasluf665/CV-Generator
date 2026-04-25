const COUNTRY_ALLOWLIST = {
    albania: 'Albania',
    andorra: 'Andorra',
    armenia: 'Armenia',
    austria: 'Austria',
    azerbaijan: 'Azerbaijan',
    belarus: 'Belarus',
    belgium: 'Belgium',
    'bosnia and herzegovina': 'Bosnia and Herzegovina',
    bulgaria: 'Bulgaria',
    croatia: 'Croatia',
    cyprus: 'Cyprus',
    czechia: 'Czechia',
    'czech republic': 'Czechia',
    denmark: 'Denmark',
    estonia: 'Estonia',
    finland: 'Finland',
    france: 'France',
    georgia: 'Georgia',
    germany: 'Germany',
    greece: 'Greece',
    hungary: 'Hungary',
    iceland: 'Iceland',
    ireland: 'Ireland',
    italy: 'Italy',
    kazakhstan: 'Kazakhstan',
    kosovo: 'Kosovo',
    latvia: 'Latvia',
    liechtenstein: 'Liechtenstein',
    lithuania: 'Lithuania',
    luxembourg: 'Luxembourg',
    malta: 'Malta',
    moldova: 'Moldova',
    monaco: 'Monaco',
    montenegro: 'Montenegro',
    netherlands: 'Netherlands',
    'north macedonia': 'North Macedonia',
    norway: 'Norway',
    poland: 'Poland',
    portugal: 'Portugal',
    romania: 'Romania',
    russia: 'Russia',
    'san marino': 'San Marino',
    serbia: 'Serbia',
    slovakia: 'Slovakia',
    slovenia: 'Slovenia',
    spain: 'Spain',
    sweden: 'Sweden',
    switzerland: 'Switzerland',
    turkey: 'Turkey',
    ukraine: 'Ukraine',
    'united kingdom': 'United Kingdom',
    uk: 'United Kingdom',
    'vatican city': 'Vatican City',
    usa: 'United States',
    us: 'United States',
    'united states': 'United States',
    'united states of america': 'United States',
    australia: 'Australia',
};

/**
 * Normalize location so country-level values are saved when possible.
 *
 * Rules:
 * - If any comma-separated segment matches a country in allowlist,
 *   save the canonical country name.
 * - Otherwise keep the original normalized input as-is (e.g. "EMEA", "Remote").
 */
export const normalizeLocation = (location) => {
    if (typeof location !== 'string') return location;

    const trimmed = location.trim();
    if (!trimmed) return trimmed;

    const normalized = trimmed.replace(/\s+/g, ' ');
    const normalizedLower = normalized.toLowerCase();

    if (COUNTRY_ALLOWLIST[normalizedLower]) {
        return COUNTRY_ALLOWLIST[normalizedLower];
    }

    const segments = normalized
        .split(',')
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean);

    for (let i = segments.length - 1; i >= 0; i -= 1) {
        const match = COUNTRY_ALLOWLIST[segments[i]];
        if (match) return match;
    }

    return normalized;
};
