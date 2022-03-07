import { axiosGET } from '@fangcha/app-request'
import { logger } from '@fangcha/logger'

describe('Test HttpProxy.test.ts', () => {
  it(`Test Proxies`, async () => {
    const url = 'http://ifconfig.co/country'
    logger.info(`Default Proxy: `, await axiosGET(url).quickSend())
    logger.info(`Default Proxy: `, await axiosGET(url).addAxiosConfig({ proxy: false }).quickSend())
  })
})
