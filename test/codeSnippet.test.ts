import {afterEach, describe, expect, it, vi} from "vitest";
import stachePlugin from "../src";
import {createCodeSnippetForDynamicImports, createCodeSnippetForStaticImports} from "../src/codeSnippets";

vi.mock('../src/codeSnippets.ts', () => {
  return {
    createCodeSnippetForDynamicImports: vi.fn(),
    createCodeSnippetForStaticImports: vi.fn(),
  }
})

describe('codeSnippet', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('dynamicImports is an empty array createCodeSnippetForDynamicImports should not be called', async () => {
    const [filePlugin,] = stachePlugin();
    filePlugin.transform(`<can-dynamic-import from="./foo" value:to="scope.vars.foo" />`, 'test.stache');
    expect(createCodeSnippetForDynamicImports).toHaveBeenCalledTimes(1)
  });

  it('dynamicImports is an empty array createCodeSnippetForDynamicImports should not be called', async () => {
    const [filePlugin,] = stachePlugin();
    filePlugin.transform(`<can-import from="./foo" value:to="scope.vars.foo" />`, 'test.stache');
    expect(createCodeSnippetForStaticImports).toHaveBeenCalledTimes(1)
  });
});
