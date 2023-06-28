const { keccak256 } = require('@ethersproject/keccak256')
const { getCreate2Address } = require('@ethersproject/address')

const globalDeployerAddress = '0x7A0D94F55792C434d74a40883C6ed8545E406D12'

exports.globalDeployerAddress = globalDeployerAddress

module.exports = async (factory, _signer) => {
  const signer = _signer ?? factory.signer
  const globalDeployerCode = await signer.provider.getCode(globalDeployerAddress)
  if (globalDeployerCode === '0x') {
    // the address that will send the tx
    const globalDeployerDeployer = '0x4c8D290a1B368ac4728d83a9e8321fC3af2b39b1'
    // the raw presigned tx
    const deployTx = '0xf87e8085174876e800830186a08080ad601f80600e600039806000f350fe60003681823780368234f58015156014578182fd5b80825250506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222'
    // first fund the deployer deployer
    const balance = await signer.provider.getBalance(globalDeployerDeployer)
    const gasPrice = BigInt(100000000000)
    const gasLimit = BigInt(100000)
    if (BigInt(balance.toString()) < gasPrice * gasLimit) {
      // send that much to the deployer address
      await signer.sendTransaction({
        to: globalDeployerDeployer,
        value: '0x' + (gasPrice * gasLimit).toString(16),
      })
      .then(t => t.wait())
    }
    // need to deploy
    await signer.provider.sendTransaction(deployTx).then(t => t.wait())
  }
  // now the global deployer should exist
  // return an object that mimics the original factory object
  return {
    deploy: async (...args) => {
      const { data, gasPrice } = await factory.getDeployTransaction(...args)
      const address = getCreate2Address(globalDeployerAddress, '0x'+Array(64).fill('0').join(''), keccak256(data))
      const code = await signer.provider.getCode(address)
      let tx = null
      if (code === '0x') {
        tx = await signer.sendTransaction({
          to: globalDeployerAddress,
          data,
          gasPrice,
        })
      }
      return Object.assign(factory.attach(address), {
        deployTransaction: tx,
      })
    }
  }
}
