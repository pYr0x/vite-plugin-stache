import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from 'vitest'
import type {PreviewServer} from 'vite'
import {preview} from 'vite'
import type {Browser, Page} from 'puppeteer'
import puppeteer from 'puppeteer'
import {getDocument, queries} from "pptr-testing-library"
import path from "path";
import {deleteMatchedFiles, writeBundle} from "./util";

async function createServer(example: string): Promise<PreviewServer> {
  return await preview({
    root: path.resolve(__dirname, '..', 'examples', example),
    configFile: false,
    preview: {
      port: 8081,
    }
  });
}

describe('dynamic import', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    await writeBundle('dynamic-import');
    // delete a file so we can see the loading error
    deleteMatchedFiles(path.resolve(__dirname, '../examples/dynamic-import/dist/assets/'), /bar.*/);

    server = await createServer('dynamic-import');
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })
  afterAll(async() => {
    await browser.close()
    await server.httpServer.close()
  })
  beforeEach(async () => {
    await page.goto(`http://localhost:8081/`)
  })

  it('resolves foo.js to scope.vars.foo', async () => {
    const foo = (await page.$('#dynamic-import-foo'))!;
    expect(await foo.evaluate( el => el.textContent)).toEqual('foo')
  })

  it("resolve a partial stache into scope.vars.partial", async () => {
    const $doc = await getDocument(page);
    expect(await queries.findByText($doc, 'partial stache')).toBeTruthy()
  })

  it("promise reject if file can not be loaded", async () => {
    const $doc = await getDocument(page);
    expect(await queries.findByText($doc, /Failed to fetch dynamically imported module/)).toBeTruthy()
  })
})

describe('import', () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page
  const port = 8081;

  beforeAll(async () => {
    await writeBundle('import');

    server = await createServer('import');
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })
  afterAll(async() => {
    await browser.close()
    await server.httpServer.close()
  })
  beforeEach(async () => {
    await page.goto(`http://localhost:${port}/`)
  })
  afterEach(() => {
  })

  it('import by can-import', async () => {
    // @ts-ignore
    const importedModule = await page.evaluate(() => window.IMPORT_MODULE)
    expect(importedModule).toEqual("module imported before render view");
  })

  it('import into local scope', async () => {
    // @ts-ignore
    const $doc = await getDocument(page);
    expect(await queries.findByText($doc, /HELLO world/)).toBeTruthy()
  })
});


describe('inline stache', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page
  const port = 8081;

  beforeAll(async () => {
    await writeBundle('inline-stache');

    server = await createServer('inline-stache');
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })
  afterAll(async() => {
    await browser.close()
    await server.httpServer.close()
  })
  beforeEach(async () => {
    await page.goto(`http://localhost:${port}/`)
  })
  afterEach(() => {
  })

  it('should render inline stache', async () => {
    // @ts-ignore
    const template = await page.evaluate(() => window.TEMPLATE)
    expect(template).not.toEqual(`<h1>Hello {{message}}</h1>`);
    // @ts-ignore
    const $doc = await getDocument(page);
    expect(await queries.findByText($doc, /Hello inline/)).toBeTruthy()
    expect(await queries.findByText($doc, /Hey stache call expression/)).toBeTruthy()
  })
})

describe('stache element', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page
  const port = 8081;

  beforeAll(async () => {
    await writeBundle('stache-element');

    server = await createServer('stache-element');
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })
  afterAll(async() => {
    await browser.close()
    await server.httpServer.close()
  })
  beforeEach(async () => {
    await page.goto(`http://localhost:${port}/`)
  })
  afterEach(() => {
  })

  it('should render the counter component', async () => {
    // @ts-ignore
    const $doc = await getDocument(page);
    expect(await queries.findByText($doc, /Count:/)).toBeTruthy()
  })
  it('add +1 by clicking the button', async () => {
    // press button and check counter to be 1
    // @ts-ignore
    const $doc = await getDocument(page);
    const button = await queries.findByRole($doc, 'button');
    await button.click();
    const span = await queries.findByTestId($doc, "counter");
    expect(await span.evaluate( el => el.textContent)).toEqual("1");

  })
})
