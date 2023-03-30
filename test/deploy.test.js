const { ethers } = require('hardhat')
const assert = require('assert')
const GlobalFactory = require('../index.js')

it('should deploy contract', async () => {
  const _factory = await ethers.getContractFactory('Test')
  const factory = await GlobalFactory(_factory)
  const contract = await factory.deploy()
  assert(contract.address)
})

it('should deploy contract with arg', async () => {
  const _factory = await ethers.getContractFactory('ArgTest')
  const factory = await GlobalFactory(_factory)
  const contract = await factory.deploy(20)
  assert(contract.address)
})

it('should get existing instance of contract', async () => {
  let addr1
  {
    const _factory = await ethers.getContractFactory('ArgTest')
    const factory = await GlobalFactory(_factory)
    const contract = await factory.deploy(21)
    assert(contract.deployTransaction)
    await contract.deployTransaction.wait()
    addr1 = contract.address
  }
  let addr2
  {
    const _factory = await ethers.getContractFactory('ArgTest')
    const factory = await GlobalFactory(_factory)
    const contract = await factory.deploy(21)
    assert.equal(contract.deployTransaction, null)
    addr2 = contract.address
  }
  assert.equal(addr1, addr2)
})
