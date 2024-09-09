import { addLineModifiers } from "./add-line-modifiers";
import { generate } from "./generate";
import { toHtml } from "./to-html";
import { tokenize } from "./tokenize";
import type { CodeSyntacticSugarConfig } from "./types";

export function highlight(
  code: string,
  config?: CodeSyntacticSugarConfig,
): string {
  const tokens = tokenize(code);
  const lines = generate(tokens);
  const linesWithModifiers = addLineModifiers(lines, config?.modifiers);
  const output = toHtml(linesWithModifiers);
  return output;
}
