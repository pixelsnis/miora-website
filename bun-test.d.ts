declare module "bun:test" {
  type Hook = () => void | Promise<void>
  type TestFn = () => void | Promise<void>

  interface Matchers<T> {
    toBe(expected: unknown): void
    toEqual(expected: unknown): void
    toBeNull(): void
    toContain(expected: unknown): void
    not: Matchers<T>
  }

  export function afterEach(callback: Hook): void
  export function beforeEach(callback: Hook): void
  export function describe(name: string, callback: Hook): void
  export function expect<T>(value: T): Matchers<T>
  export function test(name: string, callback: TestFn): void
}
