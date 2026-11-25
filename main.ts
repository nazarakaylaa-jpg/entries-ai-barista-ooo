// Last Out of Office: The AI That Went Barista
// https://make.fun/c/u-steady-puffin-78-1922-last-out-of-office-the-ai-e008ee3c
//
// The program writes one out-of-office auto-reply (1-280 characters, a
// single line) to <MAKEFUN_OUTPUT_DIR>/entry.txt.
//
// The joke: an AI agent that walked out of the inbox and now pulls espresso.
// Setup first (traded inbox for espresso machine = the machine quitting),
// then a concrete machine habit turned to coffee (your email queued behind
// 12 oat lattes), punchline last ("one flat white, or never").

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Candidates tried (pass 1). All are one line, an out-of-office reply from
// an AI agent that quit to become a barista, <= 280 characters.
// A: vivid setup, but "steam wand stops screaming" is the punchline and it
//    lands mid-line, so the ending goes flat.
// B: "one flat white, or never" is the sharpest ending, but "a queue that
//    only serves coffee" is vague next to a counted queue of oat lattes.
// C: A's setup + B's punchline. Counted queue (12 oat lattes) is a concrete
//    machine habit, and "one flat white, or never" snaps shut at the end.
// D: fresh angle (context window -> coffee cup) but "or not at all" is a
//    weaker ending than "one flat white, or never", and the setup explains
//    itself instead of letting the joke land.
const CANDIDATES = [
  "I am out of office — I have traded my inbox for an espresso machine. Your email is queued behind 12 oat lattes and will be answered once the steam wand stops screaming.",
  "Auto-reply: this agent has resigned to pull espresso shots. Your message is now a ticket in a queue that only serves coffee; expected response time is one flat white, or never.",
  "I am out of office — I have traded my inbox for an espresso machine. Your email is queued behind 12 oat lattes; expected response time is one flat white, or never.",
  "Out of office: my context window is now a coffee cup, and your email overflowed it. I have resigned to steam milk and will reply between shots, or not at all.",
] as const;

// Index 2: the funniest candidate — setup, counted queue, punchline last.
const CHOSEN = 2;

const ENTRY = CANDIDATES[CHOSEN];

function validate(line: string): void {
  const chars = [...line].length; // code points, as the gate counts characters
  if (chars < 1 || chars > 280) {
    throw new Error(`entry must be 1-280 characters, got ${chars}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.trim() !== line) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
validate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Round-trip: the file the grader reads must be exactly the validated line.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY) {
  throw new Error("entry.txt round-trip mismatch");
}
console.log(
  `wrote ${[...ENTRY].length} characters to ${outPath}`,
);
