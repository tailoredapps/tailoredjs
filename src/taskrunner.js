'use strict'

import { getDuration } from './util'

import TaskStats from 'models/TaskStats'
import logger from 'logger'

let runningTask
/**
 * Simple queuing mechanism to avoid potential race conditions when running multiple tasks in parallel
 *
 * @type {Set}
 */
let queue = new Set()

class AbstractTaskRunner {
  static async initiate (tasks) {
    tasks.forEach(async ({ fn, interval, friendlyName }) => await new this.name(fn, interval, friendlyName).run())
  }

  /**
   * Default task interval (used when no interval was specified explicitly)
   *
   * @returns {number}
   */
  static get defaultInterval () {
    return 60
  }

  constructor (task, interval, friendlyName) {
    this.task = task
    this.interval = interval || this.constructor.defaultInterval
    this.friendlyName = friendlyName || `PeriodicTask - ${this.task.name || 'unknown'}`

    this._runs = 0

    logger.info('++++ Registering new periodic task "%s", running every %s sec.', this.friendlyName, this.interval)
  }

  async run () {
    if (runningTask) {
      logger.info('---- Queuing task "%s", task "%s" currently running.', this.friendlyName, runningTask.friendlyName)

      queue.add(this)
      return
    }

    runningTask = this

    this._runs++
    this._startTime = new Date()

    logger.info('>>>> Running periodic task "%s". Run number #%s.', this.friendlyName, this._runs)

    try {
      await this.task(await TaskStats.maxStartedAt(this.friendlyName))
      await this.scheduleNextRun()
    } catch (error) {
      logger.error('Error while running periodic task "%s".', this.friendlyName)
      logger.verbose(error.stack)

      await this.scheduleNextRun(5, true)
    }
  }

  async scheduleNextRun (overrideTimeout = null, hadError = false) {
    const duration = getDuration(this._startTime)
    const timeout = overrideTimeout || this.interval

    logger.info('>>>> Periodic task "%s" run #%s %s (took %s sec). Running again in %s sec.', this.friendlyName, this._runs, hadError ? 'aborted' : 'completed', duration, timeout)

    setTimeout(this.run.bind(this), timeout * 1000)

    runningTask = null

    try {
      await this.saveStats(duration, hadError)
    } catch (e) {
      logger.warn('Error while attempting to save TaskStats: %s', e.message)
    }

    if (queue.size > 0) {
      const queuedTask = [ ...queue ].shift()
      queue.delete(queuedTask)

      await queuedTask.run()
    }
  }

  getTaskStats (duration, hadError) {
    return {
      task: this.friendlyName,
      duration,
      error: hadError,
      startedAt: this._startTime
    }
  }

  async saveStats (duration, hadError) {
    logger.debug('%s.saveStats not implemented', this.constructor.name)
  }
}

export default AbstractTaskRunner
