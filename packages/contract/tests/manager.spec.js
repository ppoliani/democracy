'use strict';

const assert = require('chai').assert
const { ContractsManager, isContract } = require('..');
const { getNetwork } = require('demo-utils')

describe('ContractsManager tests', () => {
  
  let cm

  before(async () => {
    const eth = getNetwork()
    const chainId = await eth.net_version()
    cm = new ContractsManager({sourcePathList: ['contracts'], chainId: chainId})
  })

  it( 'finds a previous compile', async () => {
    const out = await cm.getContract('TestLibrary')
    assert(isContract(out))
  })

});
