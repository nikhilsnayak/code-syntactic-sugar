# Code Syntactic Sugar

### Introduction

This package is a fork of [sugar-high](https://github.com/huozhi/sugar-high) with added features. It is specifically designed for React, producing React elements as output. This eliminates the need to use `dangerouslySetInnerHTML`. Please note, React must be installed for this package to work.

Special thanks to [Jiachi Liu](https://github.com/huozhi), the original author of [sugar-high](https://github.com/huozhi/sugar-high).

### Installation

To install the package, run:

```bash
npm install --save code-syntactic-sugar
```

### Basic Usage

```jsx
import { highlight } from 'code-syntactic-sugar';
import { createRoot } from 'react-dom/client';

function CodeBlock() {
  const code = `
  const a = 10;
  const b = 20;
  console.log(a + b);
  `.trim();

  const codeLines = highlight(code);

  return <code>{codeLines}</code>;
}

const root = createRoot(document.querySelector('#app > pre'));
root.render(<CodeBlock />);
```

### Customizing Highlighting with CSS

You can create custom themes by modifying colors for different token types. Add the following CSS to your global stylesheet. All class names use the `--css-` prefix for `code-syntactic-sugar`.

```css
/**
 * Token types in Code Syntactic Sugar:
 *
 * identifier
 * keyword
 * string
 * class, number, null
 * property
 * entity
 * JSX literals
 * sign
 * comment
 * break
 * space
 */
:root {
  --css-class: #2d5e9d;
  --css-identifier: #354150;
  --css-sign: #8996a3;
  --css-property: #0550ae;
  --css-entity: #249a97;
  --css-jsxliterals: #6266d1;
  --css-string: #00a99a;
  --css-keyword: #f47067;
  --css-comment: #a19595;
}
```

### Line Numbers

To display line numbers, use the `.css_line` class and the following CSS:

```css
pre code {
  counter-reset: css-line-number;
}

.css_line::before {
  counter-increment: css-line-number;
  content: counter(css-line-number);
  margin-right: 24px;
  text-align: right;
  color: #a4a4a4;
}
```

### CSS Class Names

Customize the appearance of tokens using the `.css__token--<token-type>` class names. For example, to style keywords:

```css
.css__token--keyword {
  background: #f47067;
}
```

### Additional Features

Code Syntactic Sugar includes several additional features that are not available in the original sugar-high package.

#### Line Modifiers

You can apply visual modifiers to specific lines of code. The available modifiers are:

- **highlighted**
- **added**
- **removed**

The `highlight` function accepts an optional configuration object of type `CodeSyntacticSugarConfig`. You can use the `modifiers` object to specify which lines to modify. If multiple modifiers are applied to the same line, the order of precedence is:

1. highlighted
2. added
3. removed

Any line numbers that are out of bounds will be ignored.

##### Example:

```jsx
import { highlight } from 'code-syntactic-sugar';
import { createRoot } from 'react-dom/client';

function CodeBlock() {
  const code = `
    let a = 1;
    let b = 10;
    const result = a + b;
    console.log(a);
    console.log(b);
    console.log(result);
  `.trim();

  const codeLines = highlight(code, {
    modifiers: {
      highlightedLines: [1, 2],
      addedLines: [4, 5],
      removedLines: [3, 0, -1, 10, 4],
    },
  });

  return <code>{codeLines}</code>;
}

const root = createRoot(document.querySelector('#app > pre'));
root.render(<CodeBlock />);
```

To style lines with different modifiers, add the following CSS:

```css
.css_line[data-highlighted-line] {
  background-color: #fefefe;
}

.css_line[data-added-line] {
  background-color: #00ff00;
}

.css_line[data-removed-line] {
  background-color: #ff0000;
}
```

### License

This project is licensed under the [MIT License](./LICENSE).
