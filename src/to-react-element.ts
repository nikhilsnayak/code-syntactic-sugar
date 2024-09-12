import { Fragment, createElement } from "react";
import type { LineWithModifiers } from "./types";
import { encode } from "./utils";

export function toReactElement(lines: LineWithModifiers[]) {
  const lineElements = lines.map((line) => {
    const tokens = line.children.map((child) => {
      const {
        tagName,
        children,
        properties: { className, style },
      } = child;
      return createElement(
        tagName,
        { className, style },
        encode(children[0].value),
      );
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
      line.tagName,
      { className: line.properties.className, ...dataAttrs },
      ...tokens,
    );
  });
  return createElement(Fragment, null, ...lineElements);
}
