import type { LineWithModifiers } from "./types";
import { encode } from "./utils";

export function toHtml(lines: LineWithModifiers[]) {
  return lines
    .map((line) => {
      const { tagName: lineTag } = line;
      const tokens = line.children
        .map((child) => {
          const { tagName, children, properties } = child;
          return `<${tagName} class="${properties.className}" style="${
            properties.style
          }">${encode(children[0].value)}</${tagName}>`;
        })
        .join("");

      const dataAttrs =
        line.modifiers
          ?.map((modifier) => `data-${modifier}`)
          ?.join(" ")
          ?.trim() ?? "";

      return `<${lineTag} class="${line.properties.className}" ${dataAttrs} >${tokens}</${lineTag}>`;
    })
    .join("\n");
}
