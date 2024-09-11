import { describe, expect, it } from "vitest";
import { addLineModifiers } from "../add-line-modifiers";
import { generate } from "../generate";
import { tokenize } from "../tokenize";
import type { Line, LineWithModifiers } from "../types";

function getLines(code: string): Line[] {
  const tokens = tokenize(code);
  const lines = generate(tokens);
  return lines;
}

describe("highlighted line modifier", () => {
  it("should add highlighted-line modifier for single line", () => {
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

  it("should not add highlighted-line modifier if line number is not in bounds", () => {
    const lines: Line[] = getLines(`let a = 1`);

    const output = addLineModifiers(lines, {
      highlightedLines: [2, -1],
    });

    const expected = lines;

    expect(output).toEqual(expected);
  });

  it("should add highlighted-line modifier for multiple lines", () => {
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

  it("should add highlighted-line modifier for lines within bounds", () => {
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

describe("added line modifier", () => {
  it("should add added-line modifier for single line", () => {
    const lines: Line[] = getLines(`let a = 1`);

    expect(lines.length).toBe(1);

    const output = addLineModifiers(lines, {
      addedLines: [1],
    });

    const [line1] = lines;

    const expected: LineWithModifiers[] = [
      {
        ...line1,
        modifiers: ["added-line"],
      },
    ];

    expect(output).toEqual(expected);
  });

  it("should not add added-line modifier if line number is not in bounds", () => {
    const lines: Line[] = getLines(`let a = 1`);

    const output = addLineModifiers(lines, {
      addedLines: [2, -1],
    });

    const expected = lines;

    expect(output).toEqual(expected);
  });

  it("should add added-line modifier for multiple lines", () => {
    const code = `
        let a = 1;
        let b = 10;
        const result = a + b;
        console.log(result)
        `.trim();

    const lines: Line[] = getLines(code);
    expect(lines.length).toBe(4);

    const output = addLineModifiers(lines, {
      addedLines: [3, 4],
    });

    const [line1, line2, line3, line4] = lines;

    const expected: LineWithModifiers[] = [
      line1,
      line2,
      {
        ...line3,
        modifiers: ["added-line"],
      },
      {
        ...line4,
        modifiers: ["added-line"],
      },
    ];

    expect(output).toEqual(expected);
  });

  it("should add added-line modifier for lines within bounds", () => {
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
      addedLines: [3, 0, -1, 10, 4],
    });

    const [line1, line2, line3, line4, ...rest] = lines;

    const expected: LineWithModifiers[] = [
      line1,
      line2,
      {
        ...line3,
        modifiers: ["added-line"],
      },
      {
        ...line4,
        modifiers: ["added-line"],
      },
      ...rest,
    ];

    expect(output).toEqual(expected);
  });
});

describe("removed line modifier", () => {
  it("should add removed-line modifier for single line", () => {
    const lines: Line[] = getLines(`let a = 1`);

    expect(lines.length).toBe(1);

    const output = addLineModifiers(lines, {
      removedLines: [1],
    });

    const [line1] = lines;

    const expected: LineWithModifiers[] = [
      {
        ...line1,
        modifiers: ["removed-line"],
      },
    ];

    expect(output).toEqual(expected);
  });

  it("should not add removed-line modifier if line number is not in bounds", () => {
    const lines: Line[] = getLines(`let a = 1`);

    const output = addLineModifiers(lines, {
      removedLines: [2, -1],
    });

    const expected = lines;

    expect(output).toEqual(expected);
  });

  it("should add removed-line modifier for multiple lines", () => {
    const code = `
        let a = 1;
        let b = 10;
        const result = a + b;
        console.log(result)
        `.trim();

    const lines: Line[] = getLines(code);
    expect(lines.length).toBe(4);

    const output = addLineModifiers(lines, {
      removedLines: [3, 4],
    });

    const [line1, line2, line3, line4] = lines;

    const expected: LineWithModifiers[] = [
      line1,
      line2,
      {
        ...line3,
        modifiers: ["removed-line"],
      },
      {
        ...line4,
        modifiers: ["removed-line"],
      },
    ];

    expect(output).toEqual(expected);
  });

  it("should add removed-line modifier for lines within bounds", () => {
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
      removedLines: [3, 0, -1, 10, 4],
    });

    const [line1, line2, line3, line4, ...rest] = lines;

    const expected: LineWithModifiers[] = [
      line1,
      line2,
      {
        ...line3,
        modifiers: ["removed-line"],
      },
      {
        ...line4,
        modifiers: ["removed-line"],
      },
      ...rest,
    ];

    expect(output).toEqual(expected);
  });
});

describe("line modifiers combinations", () => {
  it("should add highlighted-line modifier if the line number is present in highLightedLines and also in other modifiers", () => {
    const lines: Line[] = getLines(`let a = 1`);

    expect(lines.length).toBe(1);

    const output = addLineModifiers(lines, {
      highlightedLines: [1],
      removedLines: [1],
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

  it("should add added-line modifier if the line number is present in addedLines and also in removedLines", () => {
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
      highlightedLines: [1, 2],
      addedLines: [4, 5],
      removedLines: [3, 0, -1, 10, 4],
    });

    const [line1, line2, line3, line4, line5, ...rest] = lines;

    const expected: LineWithModifiers[] = [
      {
        ...line1,
        modifiers: ["highlighted-line"],
      },
      {
        ...line2,
        modifiers: ["highlighted-line"],
      },
      {
        ...line3,
        modifiers: ["removed-line"],
      },
      {
        ...line4,
        modifiers: ["added-line"],
      },
      {
        ...line5,
        modifiers: ["added-line"],
      },
      ...rest,
    ];

    expect(output).toEqual(expected);
  });

  it("should add respective modifiers", () => {
    const code = `
        let a = 1;
        let b = 10;
        const result = a + b;
        console.log(result)
        `.trim();

    const lines: Line[] = getLines(code);
    expect(lines.length).toBe(4);

    const output = addLineModifiers(lines, {
      highlightedLines: [4],
      addedLines: [1, 2, 3],
    });

    const [line1, line2, line3, line4] = lines;

    const expected: LineWithModifiers[] = [
      {
        ...line1,
        modifiers: ["added-line"],
      },
      {
        ...line2,
        modifiers: ["added-line"],
      },
      {
        ...line3,
        modifiers: ["added-line"],
      },
      {
        ...line4,
        modifiers: ["highlighted-line"],
      },
    ];

    expect(output).toEqual(expected);
  });
});
