import { axiosGET } from '@fangcha/app-request'
import { RequestFollower } from '../../src/request'

describe('Test RequestFollower.test.ts', () => {
  it(`Test useLogger`, async () => {
    const url = 'http://ifconfig.co/country'
    const observer = new RequestFollower()
    observer.useLogger = false
    await axiosGET(url).setObserver(observer).quickSend()
  })
})
