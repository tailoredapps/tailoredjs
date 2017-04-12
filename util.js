/**
 * Registers listeners that produce output on process termination
 *
 * @param logger
 * @param moduleName
 */
function registerExitListeners (logger, moduleName = 'module') {
  function getListener (sig) {
    return () => {
      logger.verbose(`---- ${moduleName} exiting via ${sig} ----`)
      process.exit()
    }
  }
  process.on('SIGTERM', getListener('SIGTERM'))
  process.on('SIGINT', getListener('SIGINT'))

  process.on('exit', (code) => {
    logger.info(`++++ ${moduleName} exiting with code ${code} ++++`)
  })

  logger.debug('Exit listeners registered.')
}

/**
 * Returns the difference between two Date objects in seconds - will instantiate a new Date object if no finish parameter is provided.
 *
 * @param start
 * @param finish
 */
function getDuration (start, finish) {
  return ((finish || new Date()) - start) / 1000
}

/**
 * Replaces tokens in a string with values from the provided "replacements" object
 *
 * All tokens will be replaced with the values of the corresponding property in the replacements object, if such a
 * property exists (i.e. is not undefined). Otherwise, token literals will be returned.
 *
 * E.g.
 *
 * replaceTokens('this {fancyProp} will be replaced, {poorMe} will not', { fancyProp: 'strange thing' })
 * // -> "this strange thing will be replaced, {poorMe} will not"
 *
 * Why not just use str.replace() you ask? Glad you mention this.
 * str.replace() will come around to bite you in the arse as soon as the string you're trying to insert contains
 * regex special characters like '$' or '^' in the wrong places. E.g. passwords ending with two dollar signs will
 * suddenly end with only one, if the replaced token happens to be at the end of the string. This makes login attempts
 * using such passwords somewhat difficult.
 * Why not just use a regex escaping module then, I hear you say. Well, because escaping these special characters
 * will, for reasons unknown to me, subsequently include the escape characters in the resulting string. Which, again,
 * complicates matters when we're dealing with passwords. Attempt to .replace() "{token}" with "pa$$" in the string
 * "password={token}" and you'll end up with "password=pa\\$\\$". Maddening.
 *
 * @param str
 * @param replacements
 * @param tokenStart
 * @param tokenEnd
 * @returns {string}
 */
function replaceTokens (str, replacements, tokenStart = '{', tokenEnd = '}') {
  return str.split(/(\{[a-z]+\})/i).map((part) => {
    if (part.startsWith(tokenStart) && part.endsWith(tokenEnd)) {
      const token = part.substring(1, part.length - 1)

      if (typeof replacements[token] !== 'undefined') {
        return replacements[token]
      }
    }

    return part
  }).join('')
}

/**
 * The simplest of utility functions - will throw an error if NODE_ENV is not set
 *
 * @param errorMessage
 */
function requireNodeEnv (errorMessage = 'NODE_ENV environment variable is not set.') {
  if (!process.env.NODE_ENV) {
    throw new Error(errorMessage)
  }
}

/**
 * Adjusts a configured port by adding the value of an environment variable to it, if that variable is set
 *
 * Can be used to dynamically adjust the port based on app instance
 *
 * @param port
 * @param envVarName
 * @returns {*}
 */
function getAdjustedPort (port, envVarName = 'NODE_APP_INSTANCE') {
  const portNum = parseInt(port, 10)
  const add = parseInt(process.env[envVarName])

  return isNaN(add) ? portNum : portNum + add
}

module.exports = {
  registerExitListeners,
  getDuration,
  replaceTokens,
  requireNodeEnv,
  getAdjustedPort
}
