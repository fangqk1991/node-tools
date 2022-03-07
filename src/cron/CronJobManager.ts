import { CronJob } from 'cron'
import { makeUUID } from '../common'

export interface CoreJob {
  name: string
  cronRule: string
  handler: () => Promise<void>
  // 默认: Asia/Shanghai
  // https://momentjs.com/timezone/
  timezone?: string
  // 任务 UUID，缺省状态下将自动生成
  uid?: string
  // 任务执行消耗的时间，毫秒
  elapsedMs?: number
}

export interface JobListener {
  onJobStart: (coreJob: CoreJob) => Promise<void>
  onJobDone: (coreJob: CoreJob) => Promise<void>
  onJobFailed: (coreJob: CoreJob, err: Error) => Promise<void>
}

export class CronJobManager {
  private _jobList: CoreJob[] = []
  private _listener?: JobListener

  public setListener(listener: JobListener) {
    this._listener = listener
  }

  public addScheduleJob(coreJob: CoreJob) {
    this.addScheduleJobList([coreJob])
  }

  public addScheduleJobList(coreJobs: CoreJob[]) {
    for (const coreJob of coreJobs) {
      coreJob.uid = coreJob.uid || makeUUID()
      coreJob.elapsedMs = -1
      this._jobList.push(coreJob)
    }
  }

  public execute() {
    const listener = this._listener
    for (const job of this._jobList) {
      const handler = async () => {
        if (listener) {
          await listener.onJobStart(job)
        }
        const startTs = Date.now()
        try {
          await job.handler()
          job.elapsedMs = Date.now() - startTs
          if (listener) {
            await listener.onJobDone(job)
          }
        } catch (e: any) {
          job.elapsedMs = Date.now() - startTs
          if (listener) {
            await listener.onJobFailed(job, e)
            throw e
          }
        }
      }
      const cronJob = new CronJob(job.cronRule, handler, null, false, job.timezone || 'Asia/Shanghai')
      cronJob.start()
    }
  }
}
