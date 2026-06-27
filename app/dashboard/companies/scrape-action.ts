"use server";
import * as cheerio from "cheerio";

type ScrapedCompany = {
  name: string;
  description: string;
};

export async function scrapeCompanyPage(
  url: string
): Promise<{ data?: ScrapedCompany; error?: string }> {
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

    if (!res.ok) return { error: `Could not fetch page (${res.status})` };

    const html = await res.text();
    const $ = cheerio.load(html);
    $("script, style, nav, footer, header, iframe, noscript").remove();

    const name =
      $('meta[property="og:site_name"]').attr("content")?.trim() ||
      $('meta[name="application-name"]').attr("content")?.trim() ||
      cleanDomain(url);

    const description =
      $('meta[property="og:description"]').attr("content")?.trim() ||
      $('meta[name="description"]').attr("content")?.trim() ||
      $("main p").first().text().trim().slice(0, 500) ||
      "";

    return { data: { name, description } };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("timeout")) return { error: "Request timed out" };
    return { error: `Failed to fetch: ${message}` };
  }
}

function cleanDomain(url: string): string {
  try {
    return new URL(url).hostname
      .replace(/^www\./, "")
      .replace(/\.(com|io|org|co|net|ai).*$/, "")
      .replace(/-/g, " ")
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  } catch {
    return "";
  }
}
