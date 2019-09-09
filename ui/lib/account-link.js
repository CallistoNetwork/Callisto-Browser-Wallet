module.exports = function (address, network) {
  const net = parseInt(network)
  let link
  switch (net) {
    case 1: // main net
      link = `https://explorer2.callisto.network/addr/${address}`
      break
    default:
      link = `https://explorer2.callisto.network/addr/${address}`
      break
  }

  return link
}
