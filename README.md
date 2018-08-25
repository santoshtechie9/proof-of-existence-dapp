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

Users can privide a proof of a document by storing its has in the blockchain. 

### Important Note
All the document uploaded using this app are stored in IPFS. So do not upload any personal information attention. Check the content carefully before  uploading.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
nodejs v8.11.3 or higher
npm v6.1.0 or higher
MetaMask browser extension
Truffle v4.1.13 or higher
ganache-cli
Solidity v0.4.24 or higher
git
```

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

## How to use the proof-of-existence dapp

### Go the the main page
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

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Go to project root directory

```
cd proof-of-existence-dapp
```

Run tests

```
truffle test
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Solidity](https://reactjs.org/docs/getting-started.html) - Smart Contract Language
* [ReactJs](https://reactjs.org/docs/getting-started.html) - Forntend web framework 
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
