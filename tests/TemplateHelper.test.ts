import * as assert from 'assert'
import { TemplateHelper } from '../src'

describe('Test TemplateHelper.test.ts', () => {
  it(`Test: renderTmpl`, async () => {
    const data = {
      prop1: 'xxxx1',
      prop2: 0,
      prop3: null,
    }
    {
      const content = TemplateHelper.renderTmpl('some template title {{.prop1}} {{.prop2}}', data)
      console.info(content)
      assert.ok(content === `some template title ${data.prop1} ${data.prop2}`)
    }
    {
      const content = TemplateHelper.renderTmpl('some template content {{.prop3}} {{.prop4}}', data)
      console.info(content)
      assert.ok(content === `some template content ${data.prop3} `)
    }
  })
})
