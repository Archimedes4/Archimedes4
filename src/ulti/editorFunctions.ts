// This function takes a line index (0 is the first line) and an array of strings with a length >= index
// This function returns the length of all the text before it
export function getOffset(index: number, arr: string[]) {
  let textBefore = arr.slice(0, index).join("")
  return textBefore.length + index
}

export function insertText(insert: string, text: string, position: number) {
  return text.substring(0, position + 1) + insert + text.substring(position + 1)
}

// This function counts escaped characters as one character
export function getTextLength(text: string) {
  return text.replaceAll("\n", "").length + (text.match(/\n/g)?.length || 0)
}

/**
 * 
 * @note Should add one to the position (if -1 base) to delete the correct character. See tests as to why
 * @param text 
 * @param position 
 * @returns 
 */
export function deleteText(text: string, position: number) {
  return text.substring(0, position - 1) + text.substring(position)
}

/**
 * Gets the width of the line number.
 * @param lines 
 */
export function getNumberWidth(lines: number): number {
  return (lines - 1).toString().length * 4.5 + 15
}

function getLine(text: string, line: number) {
  return text.split("\n")[line]
}

export function cursorAbove(text: string, position: number) {
  const lineNum = text.substring(0, position).split("\n").length

  if (lineNum === 0) {
    // Already on the first line
    return position
  }
  console.log(lineNum, text.substring(0, position))
  const offset = getOffset(lineNum, text.split("\n"))
  const linePos = position - offset
  const aboveOffset =  getOffset(lineNum - 1, text.split("\n"))
  const aboveLength = text.split("\n")[lineNum - 1].length
  // Get the next line
  if (aboveLength >= linePos) {
    return aboveOffset + linePos
  }
  return aboveOffset + aboveLength
}