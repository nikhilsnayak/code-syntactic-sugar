import { modifiers, types } from "./constants";

export const CodeSyntacticSugar = {
  TokenTypes: types,
  TokenMap: new Map(types.map((type, i) => [type, i])),
  LineModifiers: modifiers,
} as const;

export * from "./types";
export * from "./tokenize";
export * from "./generate";
export * from "./highlight";
