import { T_BREAK, types } from "./constants";
import type { Children, Line, OutputMode, Token, TokenType } from "./types";

export function generate(
  tokens: Array<Token>,
  outputMode: OutputMode = "html-string",
): Line[] {
  const lines: Line[] = [];

  const createLine = (children: Children) =>
    // generateType === 'html'
    // ? `<span class="sh__line">${content}</span>`
    ({
      type: "element",
      tagName: "span",
      children,
      properties: {
        className: "css__line",
      },
    }) as const;

  const getStyle = (token: TokenType) => {
    switch (outputMode) {
      case "html-string":
        return `color: var(--css-${token})` as const;
      case "react-element":
        return {
          color: `var(--css-${token})`,
        } as const;
      default:
        throw Error("This should not happen. There is a bug in CSS");
    }
  };

  function flushLine(tokens: Array<Token>): void {
    const lineTokens = tokens.map(([type, value]) => {
      return {
        type: "element",
        tagName: "span",
        children: [
          {
            type: "text",
            value: value, // to encode
          },
        ],
        properties: {
          className: `css__token--${types[type]}`,
          style: getStyle(types[type]),
        },
      } as const;
    });
    lines.push(createLine(lineTokens));
  }

  const lineTokens: Array<Token> = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const [type, value] = token;
    if (type !== T_BREAK) {
      // Divide multi-line token into multi-line code
      if (value.includes("\n")) {
        const lines = value.split("\n");
        for (let j = 0; j < lines.length; j++) {
          lineTokens.push([type, lines[j]]);
          if (j < lines.length - 1) {
            flushLine(lineTokens);
            lineTokens.length = 0;
          }
        }
      } else {
        lineTokens.push(token);
      }
    } else {
      lineTokens.push([type, ""]);
      flushLine(lineTokens);
      lineTokens.length = 0;
    }
  }

  if (lineTokens.length) flushLine(lineTokens);

  return lines;
}
