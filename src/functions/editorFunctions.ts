/**
 * 
 * This function takes a line index (0 is the first line) and an array of strings with a length >= index
 * @see getLineNum
 * This function returns the length of all the text before it
 */
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
  if (position === -1) {
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
  const lineNum = getLineNum(text, position)
  const lines = text.split("\n")
  const linePos = Math.max(0, getOffset(getLineNum(text, position), lines))
  if (lineNum === 0) {
    return position + 1
  }
  return (position + 1) - linePos
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
  const aboveOffset = getOffset(lineNum - 1, text.split("\n")) - 1
  const lineOffset = getOffset(lineNum, text.split("\n"))
  const linePos = getLinePosition(text, position)
  const aboveLength = getLinePosition(text, lineOffset - 2)
  // Get the next line
  if (aboveLength >= linePos) {
    return aboveOffset + linePos
  }
  return aboveOffset + aboveLength
}

export function cursorBelow(text: string, position: number): number {
  const lineNum = getLineNum(text, position)
  const linePos = getLinePosition(text, position)
  const belowOffset = getOffset(lineNum + 1, text.split("\n")) - 1
  const twoBelowOffset = getOffset(lineNum + 2, text.split("\n"))
  const belowLength = getLinePosition(text, twoBelowOffset)

  // On the last line
  if (lineNum === text.split("\n").length - 1) {
    return position
  }

  if (belowLength >= linePos) {
    return belowOffset + linePos
  }
  return belowOffset + belowLength
}

/**
 * This is designed to work with 14px apple system font
 */
export function getCharWidth(char: string): number {
  if (char === " ") {
    return 5.5
  }
  if (char === 'a') {
    return 7.58
  }

  if (["b", "d"].includes(char)) {
    return 8.45
  }

  if (char === "c") {
    return 7.69
  }

  if (char === "e") {
    return 7.85
  }

  if (char === "f") {
    return 4.92
  }

  if (char === "g") {
    return 8.38
  }

  if (char === "h") {
    return 8.09
  }

  if (char === "i") {
    return 3.31
  }

  if (char === "j") {
    return 3.3
  }

  if (char === "k") {
    return 7.45
  }
  if (char === "l") {
    return 3.39
  }
  if (char === "m") {
    return 12.03
  }
  if (char === "n") {
    return 8.02
  }
  if (char === "o") {
    return 8.13
  }
  if (char === "p") {
    return 8.4
  }
  if (char === "q") {
    return 8.38
  }
  if (char === "r") {
    return 5.19
  }
  if (char === "s") {
    return 7.18
  }
  if (char === "t") {
    return 4.94
  }
  if (char === "u") {
    return 8.02
  }
  if (char === "v") {
    return 7.44
  }
  if (char === "w") {
    return 10.7
  }
  if (char === "x") {
    return 7.2
  }
  if (char === "y") {
    return 7.45
  }
  if (char === "z") {
    return 7.4
  }
  if (char === "A") {
    return 9.29
  }
  if (char === "B") {
    return 9.05
  }
  if (char === "C") {
    return 9.88
  }
  if (char === "D") {
    return 10.02
  }
  if (char === "E") {
    return 8.2
  }
  if (char === "F") {
    return 7.87
  }
  if (char === "G") {
    return 10.3
  }
  if (char === "H") {
    return 10.24
  }
  if (char === "I") {
    return 3.6
  }
  if (char === "J") {
    return 7.38
  }
  if (char === "K") {
    return 9.08
  }
  if (char === "L") {
    return 7.8
  }
  if (char === "M") {
    return 12.09
  }
  if (char === "N") {
    return 10.24
  }
  if (char === "O") {
    return 10.66
  }
  if (char === "P") {
    return 8.75
  }
  if (char === "Q") {
    return 10.66
  }
  if (char === "R") {
    return 9
  }
  if (char === "S") {
    return 8.77
  }
  if (char === "T") {
    return 8.73
  }
  if (char === "U") {
    return 10.17
  }
  if (char === "V") {
    return 9.29
  }
  if (char === "W") {
    return 13.4
  }
  if (char === "X") {
    return 9.35
  }
  if (char === "Y") {
    return 9.02
  }
  if (char === "Z") {
    return 9.12
  }
  if (char === "1") {
    return 6.34
  }
  if (char === "2") {
    return 8.3
  }
  if (char === "3") {
    return 8.63
  }
  if (char === "4") {
    return 8.86
  }
  if (char === "5") {
    return 8.51
  }
  if (char === "6") {
    return 8.77
  }
  if (char === "7") {
    return 7.82
  }
  if (char === "8") {
    return 8.8
  }
  if (char === "9") {
    return 8.77
  }
  if (["0", "+", "<", ">"].includes(char)) {
    return 8.67
  }
  if (char === " ") {
    return 3.79
  }
  if ([".", ";", ","].includes(char)) {
    return 4.01
  }
  if (char === ",") {
    return 3.79
  }
  if (char === "/") {
    return 4.12
  }
  return 10
}