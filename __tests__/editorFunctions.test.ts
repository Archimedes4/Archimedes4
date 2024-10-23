import {cursorAbove, cursorBelow, deleteText, getLineNum, getLinePosition, getOffset, getTextLength, insertText} from "../src/ulti/editorFunctions"

test('should get the correct offset', () => { 
  expect(getOffset(0, ["hello", "this is ", "a test"])).toBe(0)
  expect(getOffset(1, ["hello", "this is ", "a test"])).toBe(6)
  expect(getOffset(2, ["hello", "this is ", "a test"])).toBe(15)
  expect(getOffset(3, ["hel", "th", "a", "three"])).toBe(9)
})

test('should insert text correctly', () => {
  expect(insertText("world", "hello", 5)).toBe("helloworld")
  expect(insertText("\n", "hello", 5)).toBe("hello\n")
  expect(insertText("\n", "This is a test", 13)).toBe("This is a test\n")
})

test('should get the correct text length', () => {
  expect(getTextLength("e\ne")).toBe(3)
})

test('should delete text correctly', () => {
  expect(deleteText("hello", 2)).toBe("hllo")
  expect(deleteText("hello", 0)).toBe("hello")
  expect(deleteText("hello", 1)).toBe("ello")
  expect(deleteText("hello", 5)).toBe("hell")
  expect(deleteText("hello", 4)).toBe("helo")
  expect(deleteText("hello", 3)).toBe("helo")
})

test('gets the correct line number', () => {
  expect(getLineNum("hello\nworld", -1)).toBe(0)
  expect(getLineNum("hello\nworld", 0)).toBe(0)
  expect(getLineNum("hello\nworld", 4)).toBe(0)
  expect(getLineNum("hello\nworld", 5)).toBe(1)
  expect(getLineNum("hello\n\nworld", 5)).toBe(1)
  expect(getLineNum("hello\n\nworld", 6)).toBe(2)
  expect(getLineNum("hello\n\nworld", 7)).toBe(2)
})

test('Finds the correct line position', () => {
  expect(getLinePosition("So\nDoes", 4)).toBe(2)
  expect(getLinePosition("So\nDoes", 3)).toBe(1)
  expect(getLinePosition("So\nDoes", 2)).toBe(0)
  expect(getLinePosition("hello\nworld", -1)).toBe(0)
  expect(getLinePosition("hello\nworld", 0)).toBe(1)
  expect(getLinePosition("hello\nworld", 1)).toBe(2)
  expect(getLinePosition("So\nDoes", 1)).toBe(2)
  expect(getLinePosition("So\nDoes", 3)).toBe(1)
  expect(getLinePosition("This\n\n\nSo", 8)).toBe(2)
})

test('Cursor above find the current position', () => {
  expect(cursorAbove("So\nDoes", 4)).toBe(1)
  expect(cursorAbove("So\nDoes", 3)).toBe(0)
  expect(cursorAbove("This\n\n\nSo", 8)).toBe(5)
})

test('Cursor below find the current position', () => {
  expect(cursorBelow("So\nDoes", 4)).toBe(4)
  expect(cursorBelow("So\nDoes", 3)).toBe(3)
  expect(cursorBelow("This\n\n\nSo", 8)).toBe(8)
  expect(cursorBelow("This thing really does not work\nSo lets test this becuase there are many problem", 30)).toBe(62)
})