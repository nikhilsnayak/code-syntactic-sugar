import type { ReactElement } from "react";
import type { modifiers, types } from "./constants";

export type Token = [number, string];

export type Children = Readonly<
  {
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
      className: `css__token--${(typeof types)[number]}`;
      style: `color: var(--css-${(typeof types)[number]})`;
    }>;
  }[]
>;

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

export type OutputMode = "html-string" | "react-element";

export type HighlightedOutput<T extends OutputMode> = T extends "html-string"
  ? string
  : T extends "react-element"
    ? ReactElement
    : never;

export type CodeSyntacticSugarConfig<T extends OutputMode> = {
  modifiers?: ModifierInputMap;
  experimental?: {
    outputMode: T;
  };
};
