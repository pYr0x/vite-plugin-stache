/**
 * @vitest-environment jsdom
 */
import {generateBundle, injectScript, getInnerText} from "./util";
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
