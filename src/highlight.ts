import { generate } from "./generate";
import { toHtml } from "./to-html";
import { tokenize } from "./tokenize";

export function highlight(code: string): string {
  const tokens = tokenize(code);
  const lines = generate(tokens);
  const output = toHtml(lines);
  return output;
}
