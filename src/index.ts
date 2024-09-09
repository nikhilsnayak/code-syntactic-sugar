import { types } from "./constants";

export const CodeSyntacticSugar = {
  TokenTypes: types,
  TokenMap: new Map(types.map((type, i) => [type, i])),
} as const;

export * from "./tokenize";
export * from "./generate";
export * from "./to-html";
export * from "./highlight";
