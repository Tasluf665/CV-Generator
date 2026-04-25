import { load } from 'cheerio';
import { ApiError } from '../../../utils/ApiError.js';

const LINKEDIN_JOB_HOSTS = new Set(['linkedin.com', 'www.linkedin.com']);

const normalizeText = (value = '') =>
    value
        .replace(/\s+/g, ' ')
        .replace(/\u00a0/g, ' ')
        .trim();

const htmlToReadableText = (html = '') => {
    const text = load(
        html
            .replace(/<\s*br\s*\/?\s*>/gi, '\n')
            .replace(/<\s*\/\s*(p|div|section|article|li|h[1-6]|ul|ol)\s*>/gi, '\n')
            .replace(/<\s*(p|div|section|article|li|h[1-6]|ul|ol)(\s[^>]*)?>/gi, '')
    ).text();

    return text
        .replace(/\r\n/g, '\n')
        .replace(/[\t ]+/g, ' ')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

const isLinkedInUrl = (url) => {
    try {
        const parsedUrl = new URL(url);
        return LINKEDIN_JOB_HOSTS.has(parsedUrl.hostname) && parsedUrl.pathname.includes('/jobs/');
    } catch {
        return false;
    }
};

const parseJsonLd = ($) => {
    const scripts = $('script[type="application/ld+json"]');

    for (let i = 0; i < scripts.length; i += 1) {
        try {
            const rawJson = $(scripts[i]).html();
            if (!rawJson) continue;

            const parsed = JSON.parse(rawJson);
            const payload = Array.isArray(parsed) ? parsed : [parsed];
            const expandedPayload = payload.flatMap((item) => {
                if (Array.isArray(item?.['@graph'])) {
                    return item['@graph'];
                }
                return [item];
            });

            const jobPosting = expandedPayload.find((item) => item?.['@type'] === 'JobPosting');
            if (!jobPosting) continue;

            const location = normalizeText(
                [
                    jobPosting?.jobLocation?.address?.addressLocality,
                    jobPosting?.jobLocation?.address?.addressRegion,
                    jobPosting?.jobLocation?.address?.addressCountry,
                ]
                    .filter(Boolean)
                    .join(', ')
            );

            return {
                jobTitle: normalizeText(jobPosting?.title || ''),
                company: normalizeText(jobPosting?.hiringOrganization?.name || ''),
                location,
                aboutTheJob: htmlToReadableText(jobPosting?.description || ''),
            };
        } catch {
            // Ignore invalid JSON-LD chunks and continue with next script tag.
        }
    }

    return null;
};

const parseFromDom = ($) => {
    const jobTitle = normalizeText(
        $('.top-card-layout__title').first().text() ||
        $('.topcard__title').first().text() ||
        $('h1').first().text() ||
        ''
    );

    const company = normalizeText(
        $('.topcard__org-name-link').first().text() ||
        $('.topcard__flavor-row .topcard__flavor').first().text() ||
        $('.top-card-layout__card .topcard__flavor').first().text() ||
        ''
    );

    const location = normalizeText(
        $('.topcard__flavor--bullet').first().text() ||
        $('.top-card-layout__first-subline .topcard__flavor').first().text() ||
        ''
    );

    const aboutTheJob = normalizeText(
        $('.show-more-less-html__markup').first().text() ||
        $('.description__text').first().text() ||
        $('.jobs-description__content').first().text() ||
        ''
    );

    return { jobTitle, company, location, aboutTheJob };
};

/**
 * Scrapes a public LinkedIn job URL and extracts basic job details.
 */
export const scrapeLinkedInJobDetails = async (linkedinUrl) => {
    if (!isLinkedInUrl(linkedinUrl)) {
        throw new ApiError(400, 'Please provide a valid LinkedIn job URL.');
    }

    let response;
    try {
        response = await fetch(linkedinUrl, {
            method: 'GET',
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml',
            },
        });
    } catch {
        throw new ApiError(502, 'Failed to reach LinkedIn. Try again in a moment.');
    }

    if (!response.ok) {
        throw new ApiError(502, `LinkedIn request failed with status ${response.status}.`);
    }

    const html = await response.text();
    const $ = load(html);

    const fromJsonLd = parseJsonLd($) || {};
    const fromDom = parseFromDom($);

    const scraped = {
        jobTitle: fromJsonLd.jobTitle || fromDom.jobTitle || '',
        company: fromJsonLd.company || fromDom.company || '',
        location: fromJsonLd.location || fromDom.location || '',
        aboutTheJob: fromJsonLd.aboutTheJob || fromDom.aboutTheJob || '',
    };

    if (!scraped.aboutTheJob || scraped.aboutTheJob.length < 40) {
        throw new ApiError(
            422,
            'Could not extract a usable “About the job” section from this LinkedIn link. Please use a public job post URL.'
        );
    }

    return scraped;
};
