'use strict'

import { replaceTokens } from './util'
import request from 'request-promise'

export const METHOD_GET = 'get'
export const METHOD_POST = 'post'
export const METHOD_PATCH = 'patch'
export const METHOD_PUT = 'put'
export const METHOD_DELETE = 'delete'

const allowedMethods = [ METHOD_GET, METHOD_POST, METHOD_PATCH, METHOD_PUT, METHOD_DELETE ]

/**
 * Returns the options object used by the request function
 *
 * Endpoint specs can contain "getPath", "getQuery" and "getBody" functions - if present, these will be called (with request
 * params passed in) and their return value will be used for request path, query string and body respectively.
 *
 * Otherwise, params will be sent in request body for requests that can have one (post, patch, put) or in the query string for
 * requests that cannot have a body (get & co).
 *
 * Endpoint spec properties:
 *
 * route        Endpoint uri ("/users", "/foo?bar={baz}&some={thing}")
 * method       Request method
 * doReplace    Attempt to replace tokens in request path (e.g. replace "{foo}" with value of params.foo in request path - will only be ignored if a getPath function has been provided)
 * getPath      (optional) Function that will be called to determine request path. Called with "route" and "params" passed in, expected to return a string.
 * getQuery     (optional) Function that will be used to determine query params. Called with "params" passed in, expected to return an object.
 * getBody      (optional) Function that will be called to determine request body. Called with "params" passed in, expected to return an object. Will not be called for requests that cannot have a body.
 *
 * @param baseUrl
 * @param endpoint
 * @param params
 * @returns {{baseUrl: *, method: *, uri: string, qs: {}, body: undefined, json: boolean}}
 */
export function getRequestSpec (baseUrl, endpoint, params) {
  const { route, method, doReplace, getPath, getQuery, getBody, json = true, ...opts } = endpoint // default to json = true for all endpoints

  const canHaveBody = method === METHOD_PATCH || method === METHOD_POST || method === METHOD_PUT
  // If no getQuery function has been provided: pass params as query string for requests that cannot have a body
  const qs = getQuery ? getQuery(params) : (!canHaveBody ? params : { })
  // If no getPath function has been provided: replace tokens from params when "doReplace" is true, otherwise use the route as is
  const uri = getPath ? getPath(route, params) : (doReplace ? replaceTokens(route, params) : route)
  // Use params as request body if no getBody function has been provided
  const body = canHaveBody ? (getBody ? getBody(params) : params) : undefined

  return {
    baseUrl,
    method,
    uri,
    qs,
    body,
    json,
    ...opts
  }
}

/**
 * Returns an async api connector function that can be used to access api endpoints in a simple and consistent manner.
 *
 * This function expects an api baseUrl as well as a list of endpoint specs and a logger object.
 * Endpoint specs are objects specifying various endpoint characteristics, such as the endpoint uri and the request method.
 *
 * The basic idea here is to abstract away the actual details of each endpoint and instead allow clients to simply get
 * data from or send data to an endpoint by calling a simple function and passing in their data as an object. Endpoint
 * URIs therefore need not be known to callers, and neither do they need to know about the actual API url or request methods.
 *
 * So, for instance, an endpoint to get a particular user might be specified as follows:
 *
 * { id: 'user_details', method: 'get', uri: '/users/{id}' }
 *
 * To access the endpoint, clients would implement the following code:
 *
 * const callApi = getConnector({ baseUrl: 'https://foo.bar/v1', endpoints: [ ... ], logger: myLoggerInstance })
 *
 * const userData = await callApi('user_details', { id: 420 })
 *
 * The "{id}" token in the endpoint uri will automatically be replaced by the value of the "id" property of the passed in params object.
 *
 * @param baseUrl
 * @param endpointSpecs
 * @param logger
 * @param requestFn
 * @returns {function(*=, *=)}
 */
export default function getConnector ({ baseUrl, endpoints: endpointSpecs, logger, requestFn = request }) {
  if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.length === 0 || !endpointSpecs || !Array.isArray(endpointSpecs) || endpointSpecs.length === 0) {
    throw new Error('Invalid arguments passed to getConnector()')
  }

  if (endpointSpecs.some(({ id, route, method }) => !id || !route || !method || !allowedMethods.includes(method.toLowerCase()))) {
    logger.debug('Endpoint specs: %s', JSON.stringify(endpointSpecs))

    throw new Error('Invalid endpoint specification encountered.')
  }

  // map endpoint ids to standardized specs
  const endpoints = new Map(endpointSpecs.map(({ id, route, method, ...props }) => [ id, { route, method: method.toLowerCase(), doReplace: route.includes('{'), ...props } ]))
  const getSpec = (...args) => getRequestSpec(baseUrl, ...args)

  return async (endpointId, params) => {
    if (!endpointId || !endpoints.has(endpointId)) {
      throw new Error(`Invalid endpoint id "${endpointId}" provided.`)
    }

    const requestOptions = getSpec(endpoints.get(endpointId), params)

    return await requestFn(requestOptions)
  }
}
