import { AppTask, AppTaskQueue } from 'fc-queue'

type Handler = () => Promise<void>

export class MutexManager {
  private readonly mutexQueueMap: { [p: string]: AppTaskQueue }

  constructor() {
    this.mutexQueueMap = {}
  }

  public checkQueueBusy(queueName: string) {
    return this.mutexQueueMap[queueName] && this.mutexQueueMap[queueName].isRunning()
  }

  public weakRun(queueName: string, handler: Handler) {
    if (this.checkQueueBusy(queueName)) {
      return false
    }
    if (!this.mutexQueueMap[queueName]) {
      const taskQueue = new AppTaskQueue()
      taskQueue.setPendingLimit(1)
      taskQueue.autoPauseWhenRunningQueueEmpty = true
      this.mutexQueueMap[queueName] = taskQueue
    }
    const taskQueue = this.mutexQueueMap[queueName]
    taskQueue.addTask(new AppTask(handler))
    taskQueue.resume()
    return true
  }
}
