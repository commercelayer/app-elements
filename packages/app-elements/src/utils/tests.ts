export function testInvariant(
  testFn: () => void,
  expectedInvariant: string
): void {
  try {
    testFn()
    // This helpers is intended to test the error massage. So it must always throw an error.
    // If `testFn()` does not trigger any error our invariant test will not run.
    throw Error('It works you should not have this when test invariants')
  } catch (e) {
    expect((e as any).toString()).toBe(
      `Invariant Violation: ${expectedInvariant}`
    )
  }
}
