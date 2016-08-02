'use strict'

import { getDuration } from './util'

// Simple queuing mechanism to avoid potential race conditions when running multple tasks in parallel
let taskRunning = false
let queue = new Set()

export default class Taskrunner {
  constructor (task, interval, logger, friendlyName = 'PeriodicTask') {
    this.task = task
    this.interval = interval
    this.friendlyName = friendlyName

    this.logger = logger
    this.runCount = 0

    this.logger.info('++++ Registering new periodic task "%s", running every %s sec.', this.friendlyName, this.interval)
  }

  async run () {
    const logger = this.logger

    if (taskRunning) {
      logger.info('---- Queuing task "%s", task "%s" currently running.', this.friendlyName, taskRunning.friendlyName)

      queue.add(this)
      return
    }

    taskRunning = this

    this.runCount++
    this._startTime = new Date()

    logger.info('>>>> Running periodic task "%s". Run number %s.', this.friendlyName, this.runCount)

    let hadError = false

    try {
      await this.task()
    } catch (err) {
      logger.error('Error while running periodic task "%s": %s.', this.friendlyName, err.message)
      logger.debug(err.stack)

      hadError = true
    }

    this.scheduleNextRun(hadError ? 5 : null, hadError)
  }

  scheduleNextRun (overrideTimeout = null, hadError = false) {
    const now = new Date()
    const elapsed = getDuration(this._startTime, now)
    const timeout = (overrideTimeout || this.interval)

    this.logger.info('>>>> Periodic task "%s" run #%s %s (took %s sec). Running again in %s sec.', this.friendlyName, this.runCount, hadError ? 'aborted' : 'completed', elapsed, timeout)

    setTimeout(this.run.bind(this), timeout * 1000)

    taskRunning = null

    if (queue.size > 0) {
      const queuedTask = [ ...queue ].shift()

      queuedTask.run()
      queue.delete(queuedTask)
    }

    this.saveStats({
      error: hadError,
      task: this.friendlyName,
      start: this._startTime,
      end: now,
      elapsed
    })
  }

  saveStats (stats) {
    this.logger.debug('"saveStats" method not implemented in class %s.', this.constructor.name)
  }
}
