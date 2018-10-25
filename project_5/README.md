# Udacity Blockchain Developer Nanodegree - Project 5


For this project, you will create a DApp by adding functionality to your smart contract and deploy it on the public testnet. To do so, you'll employ your blockchain identity to secure digital assets on the Ethereum platform using a smart contract. You will get to practice your knowledge of the basics of Solidity.

Previously, you learned to create your own private blockchain web service. In this course, you migrated your private blockchain functionality to a smart contract and created your own ERC721 non-fungible token contract!

#### Terminal output

```bash
samuel@machine:~/Dropbox/Projects/udacity-blockchain-developer-nanodegree/project_5/smart_contracts$ truffle migrate --network rinkeby --reset --compile-all
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
  Replacing Migrations...
  ... 0x4f6e266ada524b61c0b9010ef79927e847658be04e5e6718357f84f5f399aaa9
  Migrations: 0x3f55f20bc283a975ca468f3b6612d697183c3282
Saving successful migration to network...
  ... 0xd59cce5422262055de35f7294e27d361b382b8fe96b94b1284603ba8a922958b
Saving artifacts...
Running migration: 2_deploy_star_notary.js
  Replacing StarNotary...
  ... 0xaee99cadf968c08631aa91a9afaef6cb328a2ae21f2590d1a2261cc2b8a28ebc
  StarNotary: 0x219eb4a0ba979bdf28582c8996dffcb723ac46b8
Saving successful migration to network...
  ... 0xcb4e7a3b5cab537b66232ae2293cd90688ce267e4d9747b33c7d2665e8bdd75f
Saving artifacts...

```

#### Contract address

https://rinkeby.etherscan.io/address/0x219eb4a0ba979bdf28582c8996dffcb723ac46b8
```bash
0x219eb4a0ba979bdf28582c8996dffcb723ac46b8
```

#### Contract Hash

https://rinkeby.etherscan.io/tx/0xaee99cadf968c08631aa91a9afaef6cb328a2ae21f2590d1a2261cc2b8a28ebc
```bash
0xaee99cadf968c08631aa91a9afaef6cb328a2ae21f2590d1a2261cc2b8a28ebc
```

#### Transaction ID

https://rinkeby.etherscan.io/tx/0x1e345e1d7602b54dabbb3b7e74faf318a584f319185f90ffb4d0c94ee37965e9
```bash
0x1e345e1d7602b54dabbb3b7e74faf318a584f319185f90ffb4d0c94ee37965e9
```

#### Star Token id

**1**

## Udacity honor code

Giving the earnest credits to places and people who helped me make this project

- Thanks  [Bruno Tomé](https://github.com/ibrunotome) for the great help with understanding the project.


- https://solidity.readthedocs.io/en/v0.4.21/units-and-global-variables.html
- https://stackoverflow.com/questions/45539031/vm-exception-while-processing-transaction-out-of-gas
- https://ethereum.stackexchange.com/questions/53154/error-vm-exception-while-processing-transaction-out-of-gas-truffle
- https://ethereum.stackexchange.com/questions/12848/error-base-fee-exceeds-gas-limit-when-creating-new-contract-instance-using-t