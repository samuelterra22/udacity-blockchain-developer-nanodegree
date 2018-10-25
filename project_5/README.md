# Udacity Blockchain Developer Nanodegree - Project 5


For this project, you will create a DApp by adding functionality to your smart contract and deploy it on the public testnet. To do so, you'll employ your blockchain identity to secure digital assets on the Ethereum platform using a smart contract. You will get to practice your knowledge of the basics of Solidity.

Previously, you learned to create your own private blockchain web service. In this course, you migrated your private blockchain functionality to a smart contract and created your own ERC721 non-fungible token contract!

#### Terminal output

```bash
samuel@machine:~/Dropbox/Projects/udacity-blockchain-developer-nanodegree/project_5/smart_contracts$ truffle deploy --network rinkeby
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/StarNotary.sol...
Compiling openzeppelin-solidity/contracts/introspection/ERC165.sol...
Compiling openzeppelin-solidity/contracts/introspection/IERC165.sol...
Compiling openzeppelin-solidity/contracts/math/SafeMath.sol...
Compiling openzeppelin-solidity/contracts/token/ERC721/ERC721.sol...
Compiling openzeppelin-solidity/contracts/token/ERC721/IERC721.sol...
Compiling openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol...
Compiling openzeppelin-solidity/contracts/utils/Address.sol...
Writing artifacts to ./build/contracts

Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xd3facbe4a8ec3f4eb1bf2eb1b0325477f660a71f3571fa2530da0135bd3942e9
  Migrations: 0x1fb4129f5ecff01533f6f9af4df7d8cb2bfd02a4
Saving successful migration to network...
  ... 0xbfb7e6d156221e19bc97448f6245270987fa728ec0a6d3e45d5abf10551bf1b6
Saving artifacts...
Running migration: 2_deploy_star_notary.js
  Deploying StarNotary...
  ... 0xf6e99caee1dc37b9b9ca7e65a3c080459943c88c7ebe269147be64cfe0ee38b7
  StarNotary: 0xa9c54b772fadb6d5ff0dd03d179e9e577c933843
Saving successful migration to network...
  ... 0xf4b08a9ddfd9c455dfb4cc2e74fcef3ebe76252f5b1c3fa98f081ef9ebe1d1a0
Saving artifacts...

```

#### Transaction ID

https://rinkeby.etherscan.io/tx/0xf6e99caee1dc37b9b9ca7e65a3c080459943c88c7ebe269147be64cfe0ee38b7
```bash
0xf6e99caee1dc37b9b9ca7e65a3c080459943c88c7ebe269147be64cfe0ee38b7
```

#### Contract address

https://rinkeby.etherscan.io/address/0xa9c54b772fadb6d5ff0dd03d179e9e577c933843
```bash
0xa9c54b772fadb6d5ff0dd03d179e9e577c933843
```

## Udacity honor code

Giving the earnest credits to places and people who helped me make this project

- Thanks  [Bruno Tomé](https://github.com/ibrunotome) for the great help with understanding the project.


- https://solidity.readthedocs.io/en/v0.4.21/units-and-global-variables.html
- https://stackoverflow.com/questions/45539031/vm-exception-while-processing-transaction-out-of-gas
- https://ethereum.stackexchange.com/questions/53154/error-vm-exception-while-processing-transaction-out-of-gas-truffle
- https://ethereum.stackexchange.com/questions/12848/error-base-fee-exceeds-gas-limit-when-creating-new-contract-instance-using-t