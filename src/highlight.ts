import { addLineModifiers } from "./add-line-modifiers";
import { generate } from "./generate";

import { toReactElement } from "./to-react-element";
import { tokenize } from "./tokenize";
import type { CodeSyntacticSugarConfig } from "./types";

export function highlight(code: string, config?: CodeSyntacticSugarConfig) {
  const tokens = tokenize(code);

  const lines = generate(tokens);
  const linesWithModifiers = addLineModifiers(lines, config?.modifiers);
  return toReactElement(linesWithModifiers);
}
