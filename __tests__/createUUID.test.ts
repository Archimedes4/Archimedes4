import createUUID from '../src/functions/createUUID';


describe("Testing createUUID", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.6306000441453892);
    jest.spyOn(global.Date.prototype, 'getTime').mockReturnValue(1736470142);
  });

  test("Check that createUUID works.", () => {
    // The reason why the expected value is "8180a210-aaaa-4aaa-aaaa-aaaaaaaaaaaa" is because the random number is fixed.
    expect(createUUID()).toBe("8180a210-aaaa-4aaa-aaaa-aaaaaaaaaaaa");
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
    jest.spyOn(global.Date.prototype, 'getTime').mockRestore();
  })
})