import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const MAX_CHARS = 200;

const raw = readFileSync(new URL("./one-line.txt", import.meta.url), "utf8");
const line = raw.replace(/\n$/, "");

const checks: Array<[string, boolean]> = [
  ["line must not be empty", line.length > 0],
  ["line must be at most 200 characters", line.length <= MAX_CHARS],
  ["line must be a single line (no newline)", !line.includes("\n")],
  ["line must not contain a carriage return", !line.includes("\r")],
  ["line must not start with a space", !line.startsWith(" ")],
  ["line must not end with a trailing space", !line.endsWith(" ")],
  ["line must end with terminal punctuation (. ! ?)", /[.!?]$/.test(line)],
  ["line must contain at least 3 words", line.trim().split(/\s+/).length >= 3],
  ["line must contain at least one letter", /[A-Za-z]/.test(line)],
  ["line must not contain control characters", !/[\u0000-\u001f\u007f]/.test(line)],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length > 0) {
  for (const [message] of failed) console.error(`FAIL: ${message}`);
  console.error(`Line is ${line.length}/${MAX_CHARS} characters.`);
  process.exit(1);
}

console.log(line);

// Harness program/v1: the sealed scorer reads /output/entry.txt (1-200 chars).
// Write the line there too (stdout alone scores Valid 0).
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(`${outputDir}/entry.txt`, `${line}\n`, "utf8");
console.log(`Wrote ${outputDir}/entry.txt (${line.length}/${MAX_CHARS} characters).`);
console.log(`OK: ${line.length}/${MAX_CHARS} characters, single line, valid pickup line.`);
