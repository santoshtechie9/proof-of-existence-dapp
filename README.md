# Proof-Of-Existance Dapp

## Overview
Ethereum proof of existance dapp. Application frontend is developed in ReactJS, Smart Contracts are developed in Solidity. 
This application allows users to prove existence of some information by showing a time stamped picture/video.

Data could be stored in a database, but to make it truly decentralized consider storing pictures using something like IPFS. The hash of the data and any additional information is stored in a smart contract that can be referenced at a later date to verify the authenticity.

### User Stories:
A user logs into the web app. 
The app reads the user’s address and shows all of the data that they have previously uploaded.
The user can upload some data (pictures/video) to the app, as well as add a list of tags indicating the contents of the data.
Users can retrieve necessary reference data about their uploaded items to allow other people to verify the data authenticity.
Users can privide a proof of a document by storing its hash in the blockchain. 

### Important Note
All the document uploaded using this app are stored in IPFS. So do not upload any personal information. Check the content carefully before  uploading.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Requirements

What things you need to install the software and how to install them

| Software | Version |
| ------------------------------ | ------------------- |
| `nodejs` | v8.11.3 or higher |
| `npm` | v6.1.0 or higher |
| `MetaMask` |  browser extension |
| `Truffle` |  v4.1.13 or higher |
| `ganache-cli` |   |
| `Solidity` | v0.4.24 or higher  |
| `git` |   |

#### Reference links

* [nodejs](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04) - nodejs
* [Truffle](https://truffleframework.com/docs/truffle/getting-started/installation) - git
* [git](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-14-04) - git
* [ganache-cli](https://github.com/trufflesuite/ganache-cli) - ganache

### Installation

A step by step series of examples that tell you how to get a development env running

Clone the project repository.

```
git clone https://github.com/santoshtechie9/proof-of-existence-dapp.git
```

Go to the project directory

```
cd proof-of-existence-dapp
```

Install node modules

```
npm install
```

Compile Smart Contracts

```
truffle compile
```

Start a development blockchain network

```
ganache-cli
```

Mirgate smart contracts

```
truffle migrate [--reset]
```


Login to metamask with Ganache-cli seed phrases

```
copy ganache-cli seed phrase and login to metamask and select localhost
```

Start Dapp

```
npm run start
```

Start using Dapp

```
http://localhost:3000/
```

## Configuration
Open `https://remix.ethereum.org/` in a seperate browser window.

Go to run tab and select `Injected web3` under Environment dropdown.

Copy paste the ProofDB.sol contract in to remix IDE.

Select ProofDB.sol, paste the address of this contract and click on `At Address` button.

This loads the ProofDB instance.

You can allowed contracts or addressed from the remix window.

## Running the tests

This section explain how to run the automated tests for this application.

Go to project root directory

```
cd proof-of-existence-dapp
```

Run tests

```
truffle test
```

## FAQ

Q. Is the application not working ?

A. Press `ctrl+shift+i` to view the console logs in chrome.

Q. Having trouble uploading the image to IPFS?

A. Run there commands to check the connectivity and upload the image once again.

```
https://github.com/INFURA/tutorials/wiki/IPFS-and-CORS

curl -H "Origin: https://ipfs.infura.io" \
-H "Access-Control-Request-Method: POST" \
-H "Access-Control-Request-Headers: X-Requested-With" \
--verbose \
https://ipfs.infura.io:5001/api/v0/swarm/peers; echo	

curl \
-H "Origin: http://infurarocks.com" \
-H "Access-Control-Request-Method: GET" \
-H "Access-Control-Request-Headers: X-Requested-With" \
-H "Cache-Control: no-cache" \
--verbose https://ipfs.infura.io/api/v0/cat?arg=QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```

## How to use the proof-of-existence dapp(Screenshots)

### Go the the main page

Step#1: Visit the home page of the application `http://localhost:3000/`

Step#2: Go to the dashboard to view all the document the user uploaded `http://localhost:3000/dashboard`
This page displays all the documents the user has uploaded so far. Visit dashboard page after uploading the document.

Step#3: Click on upload document to upload a document `http://localhost:3000/upload`.
In this page you can uplaod a document and also enter the details. Click upload button and Go to metamask and confirm the transaction. Once you click on the confirm button the document will be uploaded to IPFS and the details are stored in ethereum blockchain. Visit dashboard page after uploading the document.

Step#4: Click on verify document page `http://localhost:3000/upload`.
Copy the `docHash` from the dashboard page for a document and paste the `docHash` in the verify form and click submit. The application will connect to blochchain to retrieve the data and download the data from IPFS and show the file. This way you can ensure that the document existance at a particular point of time.(proof of existance)

### Go to MainPage "/".
Main page of the application

![Alt text](/src/assets/mainpage.JPG?raw=true "Optional Title")

### Go to dashaboard "/dashboard".
All the documents a that belong to a user are shown in the dashboard/

![Alt text](/src/assets/dashboard.JPG?raw=true "Optional Title")

### Go to upload document "/upload".
You can add a new document by entering the details and selecting a file.

![Alt text](/src/assets/upload.JPG?raw=true "Optional Title")

### Go to verify document "/verify"
You can verify the document here by entering the hash.

![Alt text](/src/assets/verify.JPG?raw=true "Optional Title")

## Deployment

Follow the steps mentioned below to do testnet deployment.

1. Go to project directory and open truffle.js file
`cd proof-of-existence-dapp/truffle.js`

2. Open metamask and assign the seed phrase to seedWords variable
`seedWords = "seed phrase"`

3. Go to command prompt and run the truffle migrate command
`truffle migrate --network rinkeby` 

4. Deployed the dapp in rinkeby testnet. Contract address are present in `proof-of-existence-dapp/deployed_addresses.txt`.

## Built With

* [Solidity](https://reactjs.org/docs/getting-started.html) - Smart Contract Language
* [ReactJS](https://reactjs.org/docs/getting-started.html) - Forntend web framework 
* [Metamask](https://reactjs.org/docs/getting-started.html) - Browser Extension
* [IPFS](https://reactjs.org/docs/getting-started.html) - Decentralised Storage
* [npm](https://www.npmjs.com/) - Package Management
* [coreui](https://coreui.io/v1/docs/getting-started/introduction/#reactjs) - Frontend Components

## Contributing

Please read [CONTRIBUTING.md](https://github.com/santoshtechie9) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Santosh K** - *Initial work* - [santoshtechie9](https://github.com/santoshtechie9)

See also the list of [contributors](https://github.com/santoshtechie9/proof-of-existence-dapp/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* core ui reactjs modules
