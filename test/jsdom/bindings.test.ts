/**
 * @vitest-environment jsdom
 */
import {generateBundle, injectScript} from "../util";
import {describe, expect, it, beforeAll, beforeEach, afterEach} from 'vitest'
import {RollupOutput} from "rollup";

describe('bindings', () => {
  let result!: RollupOutput
  beforeAll(async () => {
    result = await generateBundle('binding')
    document.body.innerHTML = `<div id="test"></div>`;
    injectScript(result.output[0].code);
  })
  beforeEach( () => {
  })
  afterEach(() => {
  })

  it('bind to input element', () => {
    const value = document.querySelector('input')!.value
    expect(value).toEqual("input binding")
  })

});
