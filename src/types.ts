import type { CSSProperties } from "react";
import type { modifiers, types } from "./constants";

export type Token = [number, string];

export type TokenType = (typeof types)[number];

export type Child = {
  type: "element";
  tagName: "span";
  children: Readonly<
    [
      {
        type: "text";
        value: string;
      },
    ]
  >;
  properties: Readonly<{
    className: `css__token--${TokenType}`;
    style: CSSProperties;
  }>;
};

export type Children = Readonly<Child[]>;

export type Line = {
  type: "element";
  tagName: "span";
  children: Children;
  properties: {
    className: "css__line";
  };
};

export type Modifier = `${(typeof modifiers)[number]}-line`;
export type Modifiers = [Modifier, ...Modifier[]];

export type LineNumbers = [number, ...number[]];

export type LineWithModifiers = Line & {
  modifiers?: Modifiers;
};

export type ModifierInputMap = Partial<
  Record<`${(typeof modifiers)[number]}Lines`, LineNumbers>
>;

export type CodeSyntacticSugarConfig = {
  modifiers?: ModifierInputMap;
};
