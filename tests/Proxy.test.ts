describe('Test Proxy.test.ts', () => {
  it(`Proxy`, () => {
    const target = {
      getTitle: () => {
        console.info(`getTitle`)
        return 'OK'
      },
    }
    const proxy = new Proxy(target, {
      get: function (target, property) {
        return (target as any)[property]
      },
    })
    console.info(`proxy.getTitle: ${proxy.getTitle}`)
    console.info(`proxy.getTitle(): ${proxy.getTitle()}`)
  })
})
