import { readdir, readFile } from "node:fs/promises";
import { extractText, getDocumentProxy } from "unpdf";
import { chunkPage, CHUNK_SIZE_WORDS, CHUNK_OVERLAP_WORDS, type Chunk } from "./chunk.ts";
import { embedChunks, EMBEDDING_MODEL, type EmbeddedChunk } from "./embed.ts";

const DOCS_DIR = "docs";

// Covers, separators and blank pages carry no answers, only noise in the index.
const MIN_PAGE_WORDS = 20;

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export async function ingestFile(file: string): Promise<Chunk[]> {
  const pdf = await getDocumentProxy(new Uint8Array(await readFile(`${DOCS_DIR}/${file}`)));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  const pages = text as string[];

  const chunks: Chunk[] = [];
  let skipped = 0;

  pages.forEach((pageText, index) => {
    if (countWords(pageText) < MIN_PAGE_WORDS) {
      skipped++;
      return;
    }
    // Pages are 1-based for citations, matching what a reader sees in a PDF viewer.
    chunks.push(...chunkPage(pageText, file, index + 1));
  });

  if (chunks.length === 0) {
    console.warn(`  ! ${file}: no extractable text (scanned PDF?) — skipping`);
  } else {
    console.log(`  ${file}: ${totalPages} pages (${skipped} skipped) -> ${chunks.length} chunks`);
  }

  return chunks;
}

export async function ingestAll(): Promise<EmbeddedChunk[]> {
  const files = (await readdir(DOCS_DIR)).filter((f) => f.toLowerCase().endsWith(".pdf"));

  if (files.length === 0) {
    console.warn(`No PDFs found in ${DOCS_DIR}/. See ${DOCS_DIR}/README.md.`);
    return [];
  }

  console.log(`Ingesting ${files.length} PDF(s) with ${CHUNK_SIZE_WORDS}-word chunks (${CHUNK_OVERLAP_WORDS} overlap):`);

  const chunks: Chunk[] = [];
  for (const file of files) {
    chunks.push(...(await ingestFile(file)));
  }

  const words = chunks.reduce((total, chunk) => total + countWords(chunk.text), 0);
  console.log(`Total: ${chunks.length} chunks, ~${words} words`);

  console.log(`Embedding with ${EMBEDDING_MODEL}:`);
  const startedAt = Date.now();
  const embedded = await embedChunks(chunks);
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`  ${embedded.length} vectors of ${embedded[0]?.vector.length ?? 0} dimensions in ${seconds}s`);

  return embedded;
}

// Only run when this file is the entry point (npm run ingest), not when imported.
if (import.meta.main) {
  await ingestAll();
}
