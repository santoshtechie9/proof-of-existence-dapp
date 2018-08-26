var ProofDB = artifacts.require('ProofDB.sol');
var Web3 = require('web3');

contract('ProofDB contract test suit - circuit breaker, sending ether to a contract address ', function (accounts) {

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    let transferUnits = 3;

    it('test send ether to the proofDB contract', function () {

        let proofDBInstance;
        let finalBalance;
        let account_five = accounts[5];
        ProofDB.deployed().then((instance) => {
            proofDBInstance = instance;
            //let initialBalance = web3.eth.getBalance(instance.address).valueOf();
            // console.log("initialBalance", initialBalance);
            // sent the to contract account from external account
            return instance.send(web3.toWei(3, "ether"), { from: account_five });
        }).then((transReceipt) => {
            finalBalance = web3.fromWei(web3.eth.getBalance(proofDBInstance.address), "ether").valueOf();
            var expected = transferUnits;
            var actual = finalBalance;
            assert.equal(expected, actual, "final contract balance should be 3")
        })
    });

    it('test checkBalance fuction of proofDB contract', function () {

        let account_five = accounts[5];
        ProofDB.deployed().then((instance) => {
            return instance.checkBalance.call({ from: account_five });
        }).then((result) => {
            let expected = transferUnits;
            let actual = web3.fromWei(result, "ether").valueOf();
            assert.equal(expected, actual, "final contract balance should be 3")
        })
    });

    it('test withdrawBalance fuction of proofDB contract', function () {

        let account_zero = accounts[0];
        let proofDBInstance;
        let initialAcctBalance;
        let initialContractBalance;
        let finalContractBalance;
        let finalAcctBalance;
        ProofDB.deployed().then((instance) => {
            proofDBInstance = instance;
            initialAcctBalance = web3.fromWei(web3.eth.getBalance(account_zero), "ether").valueOf();
            initialContractBalance = web3.fromWei(web3.eth.getBalance(proofDBInstance.address), "ether").valueOf();
            //console.log("initialContractBalance",initialContractBalance)
            //console.log("initialAccctBalance",initialAcctBalance)
            proofDBInstance.toggleContractActive({from : account_zero});
            return proofDBInstance.withdrawFunds({ from: account_zero });
        }).then((withDrawFundsResult) => {
            finalAcctBalance = web3.fromWei(web3.eth.getBalance(account_zero), "ether").valueOf();
            finalContractBalance = web3.fromWei(web3.eth.getBalance(proofDBInstance.address), "ether").valueOf();
            //console.log("finalAcctBalance",finalAcctBalance);
            //console.log("finalContractBalance",finalContractBalance);
            let expected = Math.round(initialAcctBalance) + Math.round(initialContractBalance);
            let actual = Math.round(finalAcctBalance);
            assert.equal(expected, actual,"final account balance ");
        })
    });

})