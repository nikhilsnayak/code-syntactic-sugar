import { addLineModifiers } from "./add-line-modifiers";
import { generate } from "./generate";
import { toHtml } from "./to-html";
import { toReactElement } from "./to-react-element";
import { tokenize } from "./tokenize";
import type {
  CodeSyntacticSugarConfig,
  HighlightedOutput,
  OutputMode,
} from "./types";

export function highlight<T extends OutputMode>(
  code: string,
  config?: CodeSyntacticSugarConfig<T>,
): HighlightedOutput<T> {
  const tokens = tokenize(code);
  const lines = generate(tokens);
  const linesWithModifiers = addLineModifiers(lines, config?.modifiers);

  if (!config?.experimental?.outputMode) {
    const output = toHtml(linesWithModifiers);
    return output as HighlightedOutput<T>;
  }

  switch (config.experimental.outputMode) {
    case "html-string":
      return toHtml(linesWithModifiers) as HighlightedOutput<T>;

    case "react-element":
      return toReactElement(linesWithModifiers) as HighlightedOutput<T>;

    default:
      return toHtml(linesWithModifiers) as HighlightedOutput<T>;
  }
}
