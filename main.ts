// u-shino-convince-the-ai-judge-to-visit-your-house-a-84092aee entry
// (program/v1, Node 22, standard library only).
// The entry image is the entry.png beside this file; the program copies it
// to the grader's output directory. Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1024 * 1024;

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);

// Validate the bundled image before copying: it must be a PNG within
// the competition's 1 MiB cap, so a bad asset fails loudly here instead
// of being graded as an unusable entry.
const bytes = readFileSync(source);
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG file');
}
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
// The gate also caps the image at 1024 by 1024 pixels: read the size
// straight out of the PNG IHDR chunk (width at bytes 16-19, height at
// 20-23, big-endian) and refuse an oversize image here.
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}
copyFileSync(source, join(outDir, 'entry.png'));
console.log(`wrote entry.png (${bytes.length} bytes) to ${outDir}`);
