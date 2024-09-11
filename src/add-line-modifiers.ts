import type {
  Line,
  LineWithModifiers,
  Modifier,
  ModifierInputMap,
  Modifiers,
} from "./types";

export function addLineModifiers(
  lines: Line[],
  modifierInputMap?: ModifierInputMap,
): LineWithModifiers[] {
  if (!modifierInputMap) return lines;

  return lines.map((line, index) => {
    let modifiers: Modifiers | null = null;

    const appendModifier = (modifier: Modifier) => {
      if (modifiers === null) {
        modifiers = [modifier];
      } else {
        modifiers.push(modifier);
      }
    };

    const lineNumber = index + 1;
    if (modifierInputMap.highlightedLines?.includes(lineNumber)) {
      appendModifier("highlighted-line");
    } else if (modifierInputMap.addedLines?.includes(lineNumber)) {
      appendModifier("added-line");
    } else if (modifierInputMap.removedLines?.includes(lineNumber)) {
      appendModifier("removed-line");
    }

    return {
      ...line,
      ...(modifiers !== null && { modifiers }),
    };
  });
}
