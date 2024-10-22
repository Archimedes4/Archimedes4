// This function takes a line index (0 is the first line) and an array of strings with a length >= index
// @see getLineNum
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

/**
 * 
 * @param text The text of the entire document
 * @param position The position to get the line number (-1, infinty)
 * @returns Base 0 line number
 */
export function getLineNum(text: string, position: number): number {
  if (position <= 0) {
    return 0
  }
  return text.substring(0, position + 1).split("\n").length - 1
}

/**
 * 
 * @param text The text to find the line position
 * @param position Where the cursor is
 * @returns a number of the position on the line (i.e the position - the offset)
 * Zero is the start of the line
 */
export function getLinePosition(text: string, position: number): number {
  const lines = text.split("\n")
  const lineNum = getOffset(getLineNum(text, position), lines) - getLineNum(text, position)
  return position - lineNum
}

/**
 * 
 * @param text The text of the entire document
 * @param position 
 * @returns 
 */
export function cursorAbove(text: string, position: number): number {
  const lineNum = getLineNum(text, position)

  if (lineNum === 0) {
    // Already on the first line
    return position
  }
  const aboveOffset = getOffset(lineNum - 1, text.split("\n"))
  const lineOffset = getOffset(lineNum, text.split("\n"))
  const linePos = getLinePosition(text, position)
//  console.log(lineOffset)
  const aboveLength = getLinePosition(text, lineOffset - 1)
//  console.log(aboveOffset, linePos, aboveLength)
  // Get the next line
  if (aboveLength >= linePos) {
    return aboveOffset + linePos
  }
  return aboveOffset + aboveLength
}

export function cursorBelow(text: string, position: number): number {
  if (position >= text.length) {
    return position
  }
  const linePos = getLinePosition(text, position)
  const lineNum = getLineNum(text, position)
  const belowOffset = getOffset(lineNum + 1, text.split("\n"))
  const belowLength = getLinePosition(text, belowOffset)
  if (belowLength >= linePos) {
    return belowOffset + linePos
  }
  return belowOffset + belowLength
}