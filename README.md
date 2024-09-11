# Code Syntactic Sugar

### Introduction

This is a fork of the [sugar-high](https://github.com/huozhi/sugar-high) package with extra features.

Special thanks to [Jiachi Liu](https://github.com/huozhi), the original author of [sugar-high](https://github.com/huozhi/sugar-high).

### Installation

To install the package, run:

```sh
npm install --save code-syntactic-sugar
```

### Basic Usage

To use Code Syntactic Sugar:

```js
import { highlight } from 'code-syntactic-sugar';

const codeHTML = highlight(code);

document.querySelector('pre > code').innerHTML = codeHTML;
```

### Customizing Highlighting with CSS

Create your own theme by customizing colors for different token types. Add the following CSS to your global stylesheet. The class names start with the `--css-` (code-syntactic-sugar) prefix.

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

The `.css_line` class name is provided for each line. To display line numbers, use the following CSS:

```css
pre code {
  counter-reset: css-line-number;
}

.css_line::before {
  counter-increment: css-line-number 1;
  content: counter(css-line-number);
  margin-right: 24px;
  text-align: right;
  color: #a4a4a4;
}
```

### CSS Class Names

Customize the styling of each token by using the `.css__token--<token type>` class names:

```css
.css__token--keyword {
  background: #f47067;
}
```

### Additional Features

Code Syntactic Sugar provides additional features that are not available in the original sugar-high package.

#### Line Modifiers

You can add visual modifiers to lines of code. Available modifiers include:

- highlighted
- added
- deleted

The highlight function accepts an optional configuration object of type `CodeSyntacticSugarConfig`. You can pass a modifiers object specifying the modifier and corresponding lines.

If multiple modifiers has the same line, the priority is as follows:

1. highlighted
1. added
1. deleted

If the line number is out of bounds, then it will be ignored.

##### Example:

```js
import { highlight } from 'code-syntactic-sugar';

const code = `
  let a = 1;
  let b = 10;
  const result = a + b;
  console.log(a);
  console.log(b);
  console.log(result);
`
const codeHTML = highlight(code, {
  modifiers: {
    highlightedLines: [1, 2],
    addedLines: [4, 5],
    removedLines: [3, 0, -1, 10, 4],
  },
});

document.querySelector('pre > code').innerHTML = codeHTML;
```

Here’s how to customize lines with different modifiers using CSS:

```css
.css_line[data-highlighted-line] {
  background-color: #FEFEFE;
}

.css_line[data-added-line] {
  background-color: #00FF00;
}

.css_line[data-deleted-line] {
  background-color: #FF0000;
}
```

### License

This project is licensed under the [MIT License](./LICENSE).