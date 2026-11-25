import { readFileSync } from "node:fs";

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
  ["line must not contain control characters", !/[\u0000-\u001f\u007f]/.test(line)],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length > 0) {
  for (const [message] of failed) console.error(`FAIL: ${message}`);
  console.error(`Line is ${line.length}/${MAX_CHARS} characters.`);
  process.exit(1);
}

console.log(line);
console.log(`OK: ${line.length}/${MAX_CHARS} characters, single line, valid pickup line.`);
