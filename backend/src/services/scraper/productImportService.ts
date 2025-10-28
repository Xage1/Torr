// src/services/scraper/productImportService.ts
import fs from "fs";
import path from "path";
import prisma from "../../config/prisma.js";
import { Prisma } from "@prisma/client";

/**
 * Reads ads.json produced by your scraper and upserts products into DB.
 *
 * Non-destructive approach:
 *  - looks up product by `externalLink` (ads 'link') using findFirst
 *  - if found -> update fields (price, description, images, etc.)
 *  - if not found -> create new product
 *
 * Assumptions:
 *  - ads.json format is the same as your scraper's output (main_image_local, other_images, link, title, price, description, location)
 *  - local image paths are stored in main_image_local and other_images (relative paths)
 *
 * Returns summary { imported, updated, skipped, errors }
 */

const ADS_JSON = path.join(process.cwd(), "ads.json"); // adapt if your ads.json is in repo root or change path
const IMAGES_DIR = path.join(process.cwd(), "images");

function parsePrice(priceRaw?: string): string {
  if (!priceRaw) return "0.00";
  // Examples: "KSh 999", "KSh 12,340", "USD 12.50", "12.50"
  const numStr = (priceRaw || "")
    .replace(/[^\d.,]/g, "") // remove currency letters
    .replace(/,/g, ""); // remove commas
  const val = parseFloat(numStr || "0");
  if (Number.isNaN(val)) return "0.00";
  // return string formatted to 2 decimals (Prisma Decimal accepts string)
  return val.toFixed(2);
}

export async function importProductsFromAdsFile(): Promise<{
  imported: number;
  updated: number;
  skipped: number;
  errors: { message: string; ad?: any }[];
}> {
  const summary = { imported: 0, updated: 0, skipped: 0, errors: [] as any[] };

  if (!fs.existsSync(ADS_JSON)) {
    summary.errors.push({ message: `ads.json not found at ${ADS_JSON}` });
    return summary;
  }

  let raw: any[] = [];
  try {
    raw = JSON.parse(fs.readFileSync(ADS_JSON, "utf-8"));
  } catch (err: any) {
    summary.errors.push({ message: "Failed to parse ads.json", ad: err.message });
    return summary;
  }

  // Normalize array
  const ads = Array.isArray(raw) ? raw : [];

  for (const ad of ads) {
    try {
      const title = (ad.title || "").trim();
      if (!title) {
        summary.skipped++;
        continue;
      }

      // canonical link used for matching
      const externalLink = (ad.link || "").trim();

      // price as string "123.45"
      const priceStr = parsePrice(ad.price);

      // local image path (if provided by scraper). Prefer local path, fallback to remote url
      const mainImageLocal = ad.main_image_local ? String(ad.main_image_local) : ad.main_image || null;

      // other images may be an array of local paths or remote URLs
      const otherImages = Array.isArray(ad.other_images)
        ? ad.other_images.map((p: any) => String(p))
        : [];

      // Build product data payload
      const productData = {
        title,
        description: ad.description ?? null,
        price: priceStr, // pass string form for Prisma Decimal
        category: null as string | null,
        source: "SCRAPER",
        externalId: externalLink || null,
        // store main local path relative to repo root if exists, else remote url
        mainImage: mainImageLocal ? mainImageLocal : null,
        imageUrls: otherImages ?? [],
        // optional: store location if available
        // `location` field does not exist in current schema — we keep it out for safety
      };

      // Try find an existing product by externalId (link) OR by title fallback
      // (Note: if you later make externalId unique in Prisma, change this to upsert)
      let existing = null;
      if (productData.externalId) {
        existing = await prisma.product.findFirst({
          where: { externalId: productData.externalId },
        });
      }
      if (!existing) {
        // fallback: try matching by title & price (best-effort)
        existing = await prisma.product.findFirst({
          where: { title: title },
        });
      }

      if (!existing) {
        // create
        await prisma.product.create({
          data: {
            // adjust fields to your schema: here I map to likely Prisma fields you already have
            title: productData.title,
            description: productData.description,
            // price is Decimal column in Prisma (string accepted)
            price: productData.price,
            stock: 0, // default for scraped items — admin can set later
            category: productData.category,
            source: productData.source,
            externalId: productData.externalId,
            // you may have 'link' field in your model later; for now store the externalId
            // images mapping: mainImage -> 'mainImage' and other -> 'imageUrls' (string[])
            mainImage: productData.mainImage,
            imageUrls: productData.imageUrls,
          } as any,
        });
        summary.imported++;
      } else {
        // update existing record — only update fields that make sense
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            description: productData.description ?? existing.description,
            // update price only if it's non-zero and differs
            price: productData.price !== "0.00" ? productData.price : existing.price,
            // update mainImage only if scraper provides a local path
            mainImage: productData.mainImage ?? existing.mainImage,
            // merge image arrays (existing + new unique)
            imageUrls: Array.from(new Set([...(existing.imageUrls ?? []), ...(productData.imageUrls ?? [])])),
            externalId: productData.externalId ?? existing.externalId,
            source: productData.source ?? existing.source,
          } as any,
        });
        summary.updated++;
      }
    } catch (err: any) {
      summary.errors.push({ message: err.message || String(err), ad });
    }
  }

  return summary;
}