var Proof = artifacts.require('Proof.sol');
var Web3 = require('web3');

contract('Proof contract test suit', function (accounts) {

    let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    let docTags = web3.fromAscii("Blockchain, Ethereum, Solidity")

    // Test fetch document method on an empty data store. When none of the users have uploaded any document in the  contract.
    // the default value for docHashs is 0x0
    it('Test: Document fetch on Empty Contract', function () {

        let docHash = "0xf50aab0582350e332b469f450e38f45e77f0926dfe07cf56ee661707207a5419";
        const account_one = accounts[0];
        return Proof.deployed().then(function (instance) {
            return instance.fetchDocument.call(docHash, { from: account_one });
        }).then(function (result) {
            let expected = 0x0;
            let actual = result[0];
            assert.equal(actual, expected, 'None if the docs not exist in blockchain. Default value for bytes32 should be returned 0x0');
        })
    });

    // Test the document upload functionality for Proof.sol contract.
    // this test ensures user is be able to upload the document and fetch the document succesfully
    it('Test: Document upload functionality', function () {

        let docHash = "0x83fe5282995e8e08e1acc5104b3178637b33f0f0b1b4942e466cca005245e7ee";
        let docOwnerName = "0x7372656573617261646869";
        let ipfsHash = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7i";
        let account_one = accounts[0];

        return Proof.deployed().then(function (instance) {
            instance.uploadDocument(docHash, docOwnerName, ipfsHash, docTags, { from: account_one });
            return instance.fetchDocument.call(docHash, { from: account_one });
        }).then(function (result) {
            //console.log("result = ", result);
            //console.log("name = ", web3.toAscii(result[1]));
            let expected = docHash;
            let actual = result[0];
            assert.equal(actual, expected, 'Document Successfully Added');
        })
    });

    //Test for rate limiting this contrat ensures that User Usage Rate Limit is set to 2 upload per 120 sec.
    // contract prevents user from spaming the application. 
    // The rate limit is set per user which should restrit the user from uploading more than 2 documents with in a given time interval.
    it('Test: User Usage Rate Limiting - 3 upload per 120 sec', function () {

        let docHash_1 = "0xff635631b30d2e777fe163f46ed76b398c06ff3c3ee1de335dfe1e30b14e4faf";
        let docHash_2 = "0x340fa3ff9bb3f74457255e241750a9e9e6a6c945cc6292a378a56efbdc53ac15";
        let docHash_3 = "0x094c8923cc85b2914c65315ae27d173aa20eca02f1bcab0e523206d0ee83a26a";
        let docHash_4 = "0xd54bfd00b4dea3abc3cbe210eff7fff6387d43c1a54c97f16a37154036d51fc9";
        let ipfsHash_1 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7i";
        let ipfsHash_2 = "RmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7j";
        let ipfsHash_3 = "SmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7k";
        let ipfsHash_4 = "SmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7l";
        let docOwnerName = "supreman";
        let account_one = accounts[1];

        return Proof.deployed().then(function (instance) {
            // only 2 documents can be uploaded by a user with in 2 minutes time window
            // the fourth document should not be loaded in to blockchain
            instance.uploadDocument(docHash_1, docOwnerName, ipfsHash_1, docTags, { from: account_one });
            instance.uploadDocument(docHash_2, docOwnerName, ipfsHash_2, docTags, { from: account_one });
            instance.uploadDocument(docHash_3, docOwnerName, ipfsHash_3, docTags, { from: account_one });
            instance.uploadDocument(docHash_4, docOwnerName, ipfsHash_4, docTags, { from: account_one });
            return instance.fetchAllDocuments({ from: account_one });
        }).then(function (result) {
            //console.log(result);
            let expected = 3;
            let actual = result.length;
            assert.equal(actual, expected, 'User should be allowe to upload 3 document with in 3 seconds. Additional docs with in that time interval will be ignored.');
        })
    });


    //Test rate limiting
    //4 documents in 2 min, by 3 different users, which should be fine. all the documents should be stored in blockchain
    it('Test: User Usage Rate Limiting - Multiple documents by multiple users', function () {

        let docHash_1 = "0xff635631b30d2e777fe163f46ed76b398c06ff3c3ee1de335dfe1e30b14e4faf";
        let docHash_2 = "0x340fa3ff9bb3f74457255e241750a9e9e6a6c945cc6292a378a56efbdc53ac15";
        let docHash_3 = "0x094c8923cc85b2914c65315ae27d173aa20eca02f1bcab0e523206d0ee83a26a";
        let docHash_4 = "0xd54bfd00b4dea3abc3cbe210eff7fff6387d43c1a54c97f16a37154036d51fc9";
        let ipfsHash_1 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7i";
        let ipfsHash_2 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7j";
        let ipfsHash_3 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7k";
        let ipfsHash_4 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7l";
        let docOwnerName = "superman";
        let account_one = accounts[1];
        let account_two = accounts[2];
        let account_three = accounts[3];

        return Proof.deployed().then(function (instance) {
            // only 3 documents can be uploaded by a user with in 2 minutes time window
            // the fourth document should not be loaded in to blockchain
            instance.uploadDocument(docHash_1, docOwnerName, ipfsHash_1, docTags, { from: account_one });
            instance.uploadDocument(docHash_2, docOwnerName, ipfsHash_2, docTags, { from: account_two });
            instance.uploadDocument(docHash_3, docOwnerName, ipfsHash_3, docTags, { from: account_three });
            instance.uploadDocument(docHash_4, docOwnerName, ipfsHash_4, docTags, { from: account_one });
            return instance.fetchDocument.call(docHash_2, { from: account_two });
        }).then(function (result) {
            let expected = docHash_2;
            let actual = result[0];
            assert.equal(actual, expected, '4 documents in 2 min, but 3 different users, which should be fine');
        })
    });

    // Test fall back function
    it('Test fallback function', function () {

        let account_one = accounts[6];
        let contractInstance;
        return Proof.deployed().then((instance) => {
            contractInstance = instance;
            return instance.sendTransaction({ from: account_one, value: web3.toWei(1, "ether") });
        }).then((result) => {
            //console.log("result", result);
            //console.log("contract address:",contractInstance.address);
        })

    })

})
