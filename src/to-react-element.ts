import { Fragment, createElement } from "react";
import type { LineWithModifiers } from "./types";

export function toReactElement(lines: LineWithModifiers[]) {
  const lineElements = lines.map((line) => {
    const tokens = line.children.map((child) => {
      const {
        tagName,
        children,
        properties: { className, style },
      } = child;
      return createElement(tagName, { className, style }, children[0].value);
    });

    const dataAttrs = line.modifiers
      ?.map((modifier) => `data-${modifier}`)
      .reduce(
        (acc, cv) => {
          acc[cv] = true;

          return acc;
        },
        {} as Record<string, true>,
      );

    return createElement(
      Fragment,
      null,
      createElement(
        line.tagName,
        { className: line.properties.className, ...dataAttrs },
        ...tokens,
      ),
      lines.length > 1 ? "\n" : null,
    );
  });

  return createElement(Fragment, null, ...lineElements);
}
