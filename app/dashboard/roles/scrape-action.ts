"use server";

import * as cheerio from "cheerio";

type ScrapedRole = {
  title: string;
  company: string;
  job_description: string;
};

export async function scrapeJobPosting(
  url: string
): Promise<{ data?: ScrapedRole; error?: string }> {
  try {
    new URL(url);
  } catch {
    return { error: "Invalid URL" };
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return { error: `Could not fetch page (${res.status})` };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove script/style/nav/footer noise before extracting text
    $("script, style, nav, footer, header, iframe, noscript").remove();

    // Try JSON-LD structured data first (most reliable)
    const jsonLd = extractJsonLd($);
    if (jsonLd) {
      return {
        data: {
          title: jsonLd.title || extractTitle($),
          company: jsonLd.company || extractCompany($, url),
          job_description: jsonLd.description || extractDescription($),
        },
      };
    }

    return {
      data: {
        title: extractTitle($),
        company: extractCompany($, url),
        job_description: extractDescription($),
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("timeout")) {
      return { error: "Request timed out" };
    }
    return { error: `Failed to fetch: ${message}` };
  }
}

function extractJsonLd($: cheerio.CheerioAPI) {
  let title = "";
  let company = "";
  let description = "";

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html();
      if (!raw) return;
      const data = JSON.parse(raw);

      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const posting =
          item["@type"] === "JobPosting"
            ? item
            : item["@graph"]?.find(
                (n: Record<string, string>) => n["@type"] === "JobPosting"
              );

        if (!posting) continue;

        title = posting.title || "";
        description = stripHtml(posting.description || "");
        if (posting.hiringOrganization) {
          company =
            typeof posting.hiringOrganization === "string"
              ? posting.hiringOrganization
              : posting.hiringOrganization.name || "";
        }
        return false; // break .each()
      }
    } catch {
      // malformed JSON-LD, skip
    }
  });

  if (!title && !description) return null;
  return { title, company, description };
}

function extractTitle($: cheerio.CheerioAPI): string {
  // Open Graph title
  const ogTitle = $('meta[property="og:title"]').attr("content")?.trim();
  if (ogTitle) return cleanTitle(ogTitle);

  // Common job-title selectors used by Greenhouse, Lever, Ashby, etc.
  const selectors = [
    'h1[class*="title"]',
    'h1[class*="posting"]',
    ".posting-headline h2",
    'h1[data-qa="job-title"]',
    "h1",
  ];
  for (const sel of selectors) {
    const text = $(sel).first().text().trim();
    if (text && text.length < 200) return text;
  }

  const pageTitle = $("title").text().trim();
  return cleanTitle(pageTitle);
}

function extractCompany($: cheerio.CheerioAPI, url: string): string {
  const ogSiteName = $('meta[property="og:site_name"]').attr("content")?.trim();
  if (ogSiteName) return ogSiteName;

  // Common company-name selectors
  const selectors = [
    'span[class*="company"]',
    'div[class*="company-name"]',
    'a[class*="company"]',
    ".posting-categories .sort-by-team",
  ];
  for (const sel of selectors) {
    const text = $(sel).first().text().trim();
    if (text && text.length < 100) return text;
  }

  // Fall back to domain name
  try {
    const hostname = new URL(url).hostname
      .replace(/^www\./, "")
      .replace(/\.(com|io|org|co|jobs).*$/, "")
      .replace(/\.greenhouse$/, "")
      .replace(/\.lever$/, "")
      .replace(/^jobs\./, "");
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch {
    return "";
  }
}

function extractDescription($: cheerio.CheerioAPI): string {
  // Common job-description container selectors
  const selectors = [
    "#job-description",
    ".job-description",
    '[class*="job-description"]',
    '[class*="jobDescription"]',
    "#content .content-intro",
    ".posting-page",
    '[data-qa="job-description"]',
    ".section-wrapper",
    ".content-wrapper",
    "article",
    "main",
  ];

  for (const sel of selectors) {
    const el = $(sel).first();
    if (el.length) {
      const text = el.text().replace(/\s+/g, " ").trim();
      if (text.length > 100) return text.slice(0, 8000);
    }
  }

  // Fallback: meta description
  const metaDesc = $('meta[name="description"]').attr("content")?.trim();
  if (metaDesc) return metaDesc;

  return "";
}

function stripHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.text().replace(/\s+/g, " ").trim();
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*[\|–—]\s*(careers?|jobs?|hiring|apply now|work with us).*$/i, "")
    .replace(/\s*-\s*(careers?|jobs?|hiring|apply now|work with us).*$/i, "")
    .trim();
}
