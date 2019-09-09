const mergeMiddleware = require('json-rpc-engine/src/mergeMiddleware')
const createScaffoldMiddleware = require('json-rpc-engine/src/createScaffoldMiddleware')
const createBlockReRefMiddleware = require('eth-json-rpc-middleware/block-ref')
const createRetryOnEmptyMiddleware = require('eth-json-rpc-middleware/retryOnEmpty')
const createBlockCacheMiddleware = require('eth-json-rpc-middleware/block-cache')
const createInflightMiddleware = require('eth-json-rpc-middleware/inflight-cache')
const createBlockTrackerInspectorMiddleware = require('eth-json-rpc-middleware/block-tracker-inspector')
const providerFromMiddleware = require('eth-json-rpc-middleware/providerFromMiddleware')
const create0xinfraMiddleware = require('@callistonetwork/eth-json-rpc-0xinfra')
const createBlockTracker = require('./createBlockTracker')

module.exports = create0xinfraClient

function create0xinfraClient ({ network, platform }) {
  const infraMiddleware = create0xinfraMiddleware({ network, maxAttempts: 5, source: 'metamask' })
  const infraProvider = providerFromMiddleware(infraMiddleware)
  const blockTracker = createBlockTracker({ provider: infraProvider }, platform)

  const networkMiddleware = mergeMiddleware([
    createNetworkAndChainIdMiddleware({ network }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightMiddleware(),
    createBlockReRefMiddleware({ blockTracker, provider: infraProvider }),
    createRetryOnEmptyMiddleware({ blockTracker, provider: infraProvider }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    infraMiddleware,
  ])
  return { networkMiddleware, blockTracker }
}

function createNetworkAndChainIdMiddleware ({ network }) {
  let chainId
  let netId

  switch (network) {
    case 'mainnet':
      netId = '1'
      chainId = '0x334'
      break
    default:
      throw new Error(`create0xinfraClient - unknown network "${network}"`)
  }

  return createScaffoldMiddleware({
    eth_chainId: chainId,
    net_version: netId,
  })
}
