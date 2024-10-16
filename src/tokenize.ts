import {
  isAlpha,
  isCls,
  isCommentStart,
  isIdentifier,
  isIdentifierChar,
  isRegexStart,
  isSign,
  isSingleQuotes,
  isSpaces,
  isStrTemplateChr,
  isStringQuotation,
  isWord,
} from "./utils";

import {
  T_BREAK,
  T_CLS_NUMBER,
  T_COMMENT,
  T_ENTITY,
  T_IDENTIFIER,
  T_JSX_LITERALS,
  T_KEYWORD,
  T_PROPERTY,
  T_SIGN,
  T_SPACE,
  T_STRING,
  jsxBrackets,
  keywords,
  signs,
} from "./constants";

import type { Token } from "./types";

export function tokenize(code: string): Token[] {
  let current = "";
  let type = -1;

  let last: Token = [-1, ""];

  let beforeLast: Token = [-2, ""];

  const tokens: Token[] = [];

  /** if entered jsx tag, inside <open tag> or </close tag> */
  let __jsxEnter = false;

  /**
   * @example
   * 0 for not in jsx;
   * 1 for open jsx tag;
   * 2 for closing jsx tag;
   **/
  let __jsxTag: 0 | 1 | 2 = 0;
  let __jsxExpr = false;

  // only match paired (open + close) tags, not self-closing tags
  let __jsxStack = 0;
  const __jsxChild = () => __jsxEnter && !__jsxExpr && !__jsxTag;
  // < __content__ >
  const inJsxTag = () => __jsxTag && !__jsxChild();
  // {'__content__'}
  const inJsxLiterals = () =>
    !__jsxTag && __jsxChild() && !__jsxExpr && __jsxStack > 0;

  let __strQuote: string | null = null;
  let __strTemplateExprStack = 0;
  let __strTemplateQuoteStack = 0;
  const inStringQuotes = () => __strQuote !== null;
  const inStrTemplateLiterals = () =>
    __strTemplateQuoteStack > __strTemplateExprStack;
  const inStrTemplateExpr = () =>
    __strTemplateQuoteStack > 0 &&
    __strTemplateQuoteStack === __strTemplateExprStack;
  const inStringContent = () => inStringQuotes() || inStrTemplateLiterals();

  function classify(token: string): number {
    const isLineBreak = token === "\n";
    // First checking if they're attributes values
    if (inJsxTag()) {
      if (inStringQuotes()) {
        return T_STRING;
      }

      const [, lastToken] = last;
      if (isIdentifier(token)) {
        // classify jsx open tag
        if (lastToken === "<" || lastToken === "</") return T_ENTITY;
      }
    }
    // Then determine if they're jsx literals
    const isJsxLiterals = inJsxLiterals();
    if (isJsxLiterals) return T_JSX_LITERALS;

    // Determine strings first before other types
    if (inStringQuotes()) {
      return T_STRING;
    }
    if (keywords.has(token)) {
      return last[1] === "." ? T_IDENTIFIER : T_KEYWORD;
    }
    if (isLineBreak) {
      return T_BREAK;
    }
    if (isSpaces(token)) {
      return T_SPACE;
    }
    if (token.split("").every(isSign)) {
      return T_SIGN;
    }
    if (isCls(token)) {
      return inJsxTag() ? T_IDENTIFIER : T_CLS_NUMBER;
    }
    if (isIdentifier(token)) {
      const isLastPropDot = last[1] === "." && isIdentifier(beforeLast[1]);

      if (!inStringContent() && !isLastPropDot) return T_IDENTIFIER;
      if (isLastPropDot) return T_PROPERTY;
    }
    return T_STRING;
  }

  const append = (_type?: number, _token?: string) => {
    if (_token) {
      current = _token;
    }
    if (current) {
      type = _type || classify(current);

      const pair: Token = [type, current];
      if (type !== T_SPACE && type !== T_BREAK) {
        beforeLast = last;
        last = pair;
      }
      tokens.push(pair);
    }
    current = "";
  };
  for (let i = 0; i < code.length; i++) {
    const curr = code[i];
    const prev = code[i - 1];
    const next = code[i + 1];
    const p_c = prev + curr; // previous and current
    const c_n = curr + next; // current and next

    // Determine string quotation outside of jsx literals.
    // Inside jsx literals, string quotation is still part of it.
    if (isSingleQuotes(curr) && !inJsxLiterals()) {
      append();
      if (prev !== "\\") {
        if (__strQuote && curr === __strQuote) {
          __strQuote = null;
        } else if (!__strQuote) {
          __strQuote = curr;
        }
      }

      append(T_STRING, curr);
      continue;
    }

    if (!inStrTemplateLiterals()) {
      if (prev !== "\\n" && isStrTemplateChr(curr)) {
        append();
        append(T_STRING, curr);
        __strTemplateQuoteStack++;
        continue;
      }
    }

    if (inStrTemplateLiterals()) {
      if (prev !== "\\n" && isStrTemplateChr(curr)) {
        if (__strTemplateQuoteStack > 0) {
          append();
          __strTemplateQuoteStack--;
          append(T_STRING, curr);
          continue;
        }
      }

      if (c_n === "${") {
        __strTemplateExprStack++;
        append(T_STRING);
        append(T_SIGN, c_n);
        i++;
        continue;
      }
    }

    if (inStrTemplateExpr() && curr === "}") {
      append();
      __strTemplateExprStack--;
      append(T_SIGN, curr);
      continue;
    }

    if (__jsxChild()) {
      if (curr === "{") {
        append();
        append(T_SIGN, curr);
        __jsxExpr = true;
        continue;
      }
    }

    if (__jsxEnter) {
      // <: open tag sign
      // new '<' not inside jsx
      if (!__jsxTag && curr === "<") {
        append();
        if (next === "/") {
          // close tag
          __jsxTag = 2;
          current = c_n;
          i++;
        } else {
          // open tag
          __jsxTag = 1;
          current = curr;
        }
        append(T_SIGN);
        continue;
      }
      if (__jsxTag) {
        // >: open tag close sign or closing tag closing sign
        // and it's not `=>` or `/>`
        // `curr` could be `>` or `/`
        if (curr === ">" && !"/=".includes(prev)) {
          append();
          if (__jsxTag === 1) {
            __jsxTag = 0;
            __jsxStack++;
          } else {
            __jsxTag = 0;
            __jsxEnter = false;
          }
          append(T_SIGN, curr);
          continue;
        }

        // >: tag self close sign or close tag sign
        if (c_n === "/>" || c_n === "</") {
          // if current token is not part of close tag sign, push it first
          if (current !== "<" && current !== "/") {
            append();
          }

          if (c_n === "/>") {
            __jsxTag = 0;
          } else {
            // is '</'
            __jsxStack--;
          }

          if (!__jsxStack) __jsxEnter = false;

          current = c_n;
          i++;
          append(T_SIGN);
          continue;
        }

        // <: open tag sign
        if (curr === "<") {
          append();
          current = curr;
          append(T_SIGN);
          continue;
        }

        // jsx property
        // `-` in data-prop
        if (next === "-" && !inStringContent() && !inJsxLiterals()) {
          if (current) {
            append(T_PROPERTY, current + curr + next);
            i += 1;
            continue;
          }
        }
        // `=` in property=<value>
        if (next === "=" && !inStringContent()) {
          // if current is not a space, ensure `prop` is a property
          if (isSpaces(current)) {
            append(T_SPACE, current);
            current = "";
          }
          const prop = current ? current + curr : curr;
          if (isIdentifier(prop)) {
            current = prop;
            append(T_PROPERTY);
          }
          continue;
        }
      }
    }

    // if it's not in a jsx tag declaration or a string, close child if next is jsx close tag
    if (
      !__jsxTag &&
      ((curr === "<" && isIdentifierChar(next)) || c_n === "</")
    ) {
      __jsxTag = next === "/" ? 2 : 1;

      // current and next char can form a jsx open or close tag
      if (curr === "<" && (next === "/" || isAlpha(next))) {
        __jsxEnter = true;
      }
    }

    const isQuotationChar = isStringQuotation(curr);
    const isStringTemplateLiterals = inStrTemplateLiterals();
    const isRegexChar = !__jsxEnter && isRegexStart(c_n);
    const isJsxLiterals = inJsxLiterals();

    // string quotation
    if (
      isQuotationChar ||
      isStringTemplateLiterals ||
      (__strQuote && isSingleQuotes(__strQuote))
    ) {
      current += curr;
    } else if (isRegexChar) {
      append();
      const [lastType, lastToken] = last;
      // Special cases that are not considered as regex:
      // * (expr1) / expr2: `)` before `/` operator is still in expression
      // * <non comment start>/ expr: non comment start before `/` is not regex
      if (
        isRegexChar &&
        lastType !== -1 &&
        !((lastType === T_SIGN && ")" !== lastToken) || lastType === T_COMMENT)
      ) {
        current = curr;
        append();
        continue;
      }

      const start = i++;

      // end of line of end of file
      const isEof = () => i >= code.length;
      const isEol = () => isEof() || code[i] === "\n";

      let foundClose = false;
      // regex
      for (; !isEol(); i++) {
        if (code[i] === "/" && code[i - 1] !== "\\") {
          foundClose = true;
          // append regex flags
          while (start !== i && /^[a-z]$/.test(code[i + 1]) && !isEol()) {
            i++;
          }
          break;
        }
      }
      if (start !== i && foundClose) {
        // If current line is fully closed with string quotes or regex slashes,
        // add them to tokens
        current = code.slice(start, i + 1);
        append(T_STRING);
      } else {
        // If it doesn't match any of the above, just leave it as operator and move on
        current = curr;
        append();
        i = start;
      }
    } else if (isCommentStart(c_n)) {
      append();
      const start = i;
      if (next === "/") {
        for (; i < code.length && code[i] !== "\n"; i++);
      } else {
        for (; i < code.length && code[i - 1] + code[i] !== "*/"; i++);
      }
      current = code.slice(start, i + 1);
      append(T_COMMENT);
    } else if (curr === " " || curr === "\n") {
      if (curr === " " && (isSpaces(current) || !current || isJsxLiterals)) {
        current += curr;
        if (next === "<") {
          append();
        }
      } else {
        append();
        current = curr;
        append();
      }
    } else {
      if (__jsxExpr && curr === "}") {
        append();
        current = curr;
        append();
        __jsxExpr = false;
      } else if (
        // it's jsx literals and is not a jsx bracket
        (isJsxLiterals && !jsxBrackets.has(curr)) ||
        // same type char as previous one in current token
        ((isWord(curr) === isWord(current[current.length - 1]) ||
          __jsxChild()) &&
          !signs.has(curr))
      ) {
        current += curr;
      } else {
        if (p_c === "</") {
          current = p_c;
        }
        append();

        if (p_c !== "</") {
          current = curr;
        }
        if (c_n === "</" || c_n === "/>") {
          current = c_n;
          append();
          i++;
        } else if (jsxBrackets.has(curr)) append();
      }
    }
  }

  append();

  return tokens;
}
