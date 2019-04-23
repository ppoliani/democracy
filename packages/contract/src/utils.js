'use strict'

const { Logger } = require('demo-utils')
const LOGGER = new Logger('contract/utils')

const { keccak } = require('ethereumjs-util')
const { Map } = require('immutable')

const utils = {}

/**
 * Chain and return a (possibly asynchronous) call after the outputter,
 * also possibly asynchronous. 
 * @param outputCallResult the result of calling outputter method, will have a `then`
 *        property if it's thenable / asynchronous.
 * @param callback method, possibly asynchronous, which accepts as input the
 *        return value of the outputter method call (`outputCallResult`) 
 */
utils.awaitOutputter = (outputCallResult, afterOutput) => {
  if (outputCallResult.then) {
    return outputCallResult.then(afterOutput) 
  } else {
    return afterOutput(outputCallResult)
  }
}

/**
 * Chain and return a (possibly asynchronous) call after the inputter,
 * also possibly asynchronous
 * @param inputCallResult the result of calling the inputter method on some args
 *        will have a `then` property if it's thenable / asynchronous
 * @param callback method, possibly asynchronous, which accepts as input the
 *        return value of the inputter method call (`inputCallResult`)
 */
utils.awaitInputter = (inputCallResult, afterInput) => {
  if (inputCallResult.then) {
    return inputCallResult.then(afterInput)
  } else {
    return afterInput(inputCallResult)
  }
}

/**
 * @return true if the given object is a compile output from a Compiler, otherwise false
 */
utils.isCompile = (_compile) => {
  return (_compile && Map.isMap(_compile) && _compile.count() > 0 &&
          _compile.reduce((prev, val) => {
    return prev && val.get('type') === 'compile'
  }, true))
}

/**
 * @return true if the given object is a compile output retrieved from db, otherwise false
 */
utils.isContract = (_contract) => {
  return (Map.isMap(_contract) && _contract.get('type') === 'compile')
}

/**
 * Filter out which requested inputs are out-of-date by source hash or are new,
 * and need to be recompiled, based on the existing outputs.
 * @param requestedInputs Immutable {Map} of keys and values that are inputs to be built
 * @param existingOutputs Immutable {Map} with matching keys and values that represent
 *        built outputs, including a member `inputHash` that matches a `requestedInput`
 *        value that will deterministically reproduce this output
 * @return a Map of keys and values from {requestedInputs}
 */
utils.getInputsToBuild = (requestedInputs, existingOutputs) => {
  return new Map(requestedInputs.map((val,key) => {
    const isNew = !existingOutputs.has(key)
    // We take the hash of content before it has the field 'inputHash'
    const inputHash = keccak(JSON.stringify(val.toJS())).toString('hex')
    const isUpdated = !isNew && (existingOutputs.get(key).get('inputHash') !== inputHash)
    if (isNew) {
      LOGGER.info(`${key} has not been built before.`)
    }
    if (isUpdated) {
      LOGGER.info(`${key} is not up-to-date with hash ${inputHash}`)
    }
    return val.set('isUpdated', isUpdated).set('isNew', isNew)
  })).filter((val, key) => { 
    return val.get('isUpdated') || val.get('isNew')
  })
}

module.exports = utils
