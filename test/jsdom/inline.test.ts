/**
 * @vitest-environment jsdom
 */
import {generateBundle, injectScript} from "../util";
import {describe, expect, it, beforeAll, beforeEach, afterEach} from 'vitest'
import {RollupOutput} from "rollup";

describe('inline stache', () => {
  let result!: RollupOutput
  beforeAll(async () => {
    result = await generateBundle('inline-stache')
    document.body.innerHTML = `<div id="test"></div>`;
    injectScript(result.output[0].code);
  })
  beforeEach( () => {
  })
  afterEach(() => {
  })

  it('should create an stache array expression', () => {
    expect(result.output[0].code).not.toContain("<h1>Hello {{message}}</h1>")
  })
})
