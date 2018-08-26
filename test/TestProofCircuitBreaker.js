var Proof = artifacts.require('Proof.sol');
var Web3 = require('web3');

contract('Proof contract test suit - circuit breaker, sending ether to a contract address ', function (accounts) {

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    let transferUnits = 3;

    it('test send ether to the proofDB contract', function () {

        let proofInstance;
        let finalBalance;
        let account_five = accounts[5];
        Proof.deployed().then((instance) => {
            proofInstance = instance;
            //let initialBalance = web3.eth.getBalance(instance.address).valueOf();
            // console.log("initialBalance", initialBalance);
            // sent the to contract account from external account
            return instance.send(web3.toWei(3, "ether"), { from: account_five });
        }).then((transReceipt) => {
            finalBalance = web3.fromWei(web3.eth.getBalance(proofInstance.address), "ether").valueOf();
            var expected = transferUnits;
            var actual = finalBalance;
            assert.equal(expected, actual, "final contract balance should be 3")
        })
    });

    it('test checkBalance fuction of proofDB contract', function () {

        let account_five = accounts[5];
        Proof.deployed().then((instance) => {
            return instance.checkBalance.call({ from: account_five });
        }).then((result) => {
            let expected = transferUnits;
            let actual = web3.fromWei(result, "ether").valueOf();
            assert.equal(expected, actual, "final contract balance should be 3")
        })
    });

    // withdrawFunds can only be involed by the owner.
    // withdrawFunds can only be invoked when the contract is paused(circuit breaker)
    it('test withdrawBalance fuction of proofDB contract', function () {

        let account_zero = accounts[0];
        let proofInstance;
        let initialAcctBalance;
        let initialContractBalance;
        let finalContractBalance;
        let finalAcctBalance;
        Proof.deployed().then((instance) => {
            proofInstance = instance;
            initialAcctBalance = web3.fromWei(web3.eth.getBalance(account_zero), "ether").valueOf();
            initialContractBalance = web3.fromWei(web3.eth.getBalance(proofInstance.address), "ether").valueOf();
            // this method will pause the contract functinality(circuit breaker)
            proofInstance.toggleContractActive({from : account_zero});
            //console.log("initialContractBalance",initialContractBalance)
            //console.log("initialAccctBalance",initialAcctBalance)
            return proofInstance.withdrawFunds({ from: account_zero });
        }).then((withDrawFundsResult) => {
            finalAcctBalance = web3.fromWei(web3.eth.getBalance(account_zero), "ether").valueOf();
            finalContractBalance = web3.fromWei(web3.eth.getBalance(proofInstance.address), "ether").valueOf();
            //console.log("finalAcctBalance",finalAcctBalance);
            //console.log("finalContractBalance",finalContractBalance);
            let expected = Math.round(initialAcctBalance) + Math.round(initialContractBalance);
            let actual = Math.round(finalAcctBalance);
            assert.equal(expected, actual,"final account balance ");
        })
    });

})
