import {deleteText, getOffset, getTextLength, insertText} from "../src/ulti/editorFunctions"

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