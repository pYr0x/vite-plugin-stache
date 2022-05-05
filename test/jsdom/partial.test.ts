/**
 * @vitest-environment jsdom
 */
import {generateBundle, injectScript, getInnerText} from "../util";
import {describe, expect, it, beforeAll, beforeEach, afterEach} from 'vitest'
import {RollupOutput} from "rollup";

describe('partial', () => {
  let result!: RollupOutput
  beforeAll(async () => {
    result = await generateBundle('partial')
    document.body.innerHTML = `<div id="test"></div>`;
    injectScript(result.output[0].code);
  })
  beforeEach( () => {
  })
  afterEach(() => {
  })

  it('should render a partial by calling a view', () => {
    const text = getInnerText(document.querySelector<HTMLElement>('#test'));
    expect(text).toEqual("partial rendered !");
  })
});
