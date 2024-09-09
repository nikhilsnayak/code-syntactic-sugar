import { describe, expect, it } from "vitest";
import { addLineModifiers } from "../add-line-modifiers";
import { generate } from "../generate";
import { highlight } from "../highlight";
import { tokenize } from "../tokenize";
import type { Line, LineWithModifiers } from "../types";

function getLines(code: string): Line[] {
  const tokens = tokenize(code);
  const lines = generate(tokens);
  return lines;
}

describe("data-highlighted-line line modifier", () => {
  it("should add data-highlighted-line modifier for single line", () => {
    const lines: Line[] = getLines(`let a = 1`);

    expect(lines.length).toBe(1);

    const output = addLineModifiers(lines, {
      highlightedLines: [1],
    });

    const [line1] = lines;

    const expected: LineWithModifiers[] = [
      {
        ...line1,
        modifiers: ["highlighted-line"],
      },
    ];

    expect(output).toEqual(expected);
  });

  it("should not data-highlighted-line modifier if line number is not in bounds", () => {
    const lines: Line[] = getLines(`let a = 1`);

    const output = addLineModifiers(lines, {
      highlightedLines: [2, -1],
    });

    const expected = lines;

    expect(output).toEqual(expected);
  });

  it("should add data-highlighted-line modifier for multiple lines", () => {
    const code = `
        let a = 1;
        let b = 10;
        const result = a + b;
        console.log(result)
        `.trim();

    const lines: Line[] = getLines(code);
    expect(lines.length).toBe(4);

    const output = addLineModifiers(lines, {
      highlightedLines: [3, 4],
    });

    const [line1, line2, line3, line4] = lines;

    const expected: LineWithModifiers[] = [
      line1,
      line2,
      {
        ...line3,
        modifiers: ["highlighted-line"],
      },
      {
        ...line4,
        modifiers: ["highlighted-line"],
      },
    ];

    expect(output).toEqual(expected);
  });

  it("should add data-highlighted-line modifier for lines within bounds", () => {
    const code = `
        let a = 1;
        let b = 10;
        const result = a + b;
        console.log(a)
        console.log(b)
        console.log(result)
        `.trim();

    const lines: Line[] = getLines(code);
    expect(lines.length).toBe(6);

    const output = addLineModifiers(lines, {
      highlightedLines: [3, 0, -1, 10, 4],
    });

    const [line1, line2, line3, line4, ...rest] = lines;

    const expected: LineWithModifiers[] = [
      line1,
      line2,
      {
        ...line3,
        modifiers: ["highlighted-line"],
      },
      {
        ...line4,
        modifiers: ["highlighted-line"],
      },
      ...rest,
    ];

    expect(output).toEqual(expected);
  });
});
