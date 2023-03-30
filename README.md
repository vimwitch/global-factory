# global-factory [![CircleCI](https://dl.circleci.com/status-badge/img/gh/vimwitch/global-factory/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/vimwitch/global-factory/tree/main)

Transform an Ethers contract factory into a deterministic factory.

## How does this work

This utility will create a deterministic `create2` deployer contract on any evm chain. This is done using a transaction from an account with an unknown private key. As a result the deployer contract can always be created, DOS attacks are not possible.

Because the deployer contract uses `create2` and is guaranteed to always have the same address, any contracts deployed from this contract will have the same address.

Internally uses [zoltu/deterministic-deployment-proxy](https://github.com/Zoltu/deterministic-deployment-proxy/tree/49f29698ce95bd510a18cabb94fd8ba4d352d687#deterministic-deployment-proxy).

## Usage

`npm i global-factory`

Then use it in a deploy script like this:

```js
const GlobalFactory = require('global-factory')

// Get the normal factory
const _factory = await ethers.getContractFactory('TestContract')
// Turn it into a global factory, the signer on the factory will be used
const factory = await GlobalFactory(_factory)
// define a factory with a custom signer like so
const factoryWithCustomSigner = await GlobalFactory(_factory, customSigner)
// Then deploy as usual
const contract = await factory.deploy(arg1, arg2)
```

If the contract already exists no deployment will occur and the existing instance will be returned. In this case the property `deployTransaction` will be `null`.

If the global deployer contract does not exist it will be deployed.

## License

MIT
