export interface ChannelEntity<T = any> {
  isRunning: boolean
  isDone: boolean
  pendingCount: number
  result?: T
}

export type Handler<T> = () => Promise<T>
