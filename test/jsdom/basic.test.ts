/**
 * @vitest-environment jsdom
 */
import {generateBundle, injectScript} from "../util";
import {describe, expect, it, beforeAll, beforeEach, afterEach} from 'vitest'
import {RollupOutput} from "rollup";


describe('basic', () => {
  let result!: RollupOutput
  beforeAll(async () => {
    result = await generateBundle('basic')
    document.body.innerHTML = `<div id="test"></div>`;
    injectScript(result.output[0].code);
  })
  beforeEach( () => {
  })
  afterEach(() => {
  })

  it('should show correct output', () => {
    expect(document.querySelector('#test')!.innerHTML).toEqual("hello world");
  })
})
