var ProofOfOwnership = artifacts.require('ProofOfOwnership.sol')


contract('Test ProofOfOwnership functionality', function(accounts){

    it('test fetch document function on empty contract',function(){
        let docHash = "ff635631b30d2e777fe163f46ed76b398c06ff3c3ee1de335dfe1e30b14e4faf";
        return ProofOfOwnership.deployed().then(function(instance){
            return instance.fetchDocumentDetails.call(docHash,{from:accounts[1]});
        }).then(function(result){
            let expected = "";
            let actual = result[0];
            assert.equal( actual,expected,'contract should return empty string when a document does not exist in blockchain');
        })
    });
    
    it('test add document function',function(){
        let docHash = "ff635631b30d2e777fe163f46ed76b398c06ff3c3ee1de335dfe1e30b14e4faf";
        let docTimestamp ="2018-08-15 09:30:00";
        let docOwnerName = "Santu";

        return ProofOfOwnership.deployed().then(function(instance){
            instance.addDocument(docHash,docTimestamp,docOwnerName,{from:accounts[0]});
            return instance.fetchDocumentDetails.call(docHash,{from:accounts[0]});
        }).then(function(result){
            //console.log(result);
            let expected = docHash;
            let actual = result[0];
            assert.equal( actual,expected,'the function should return true');
        })
    });

    it('test rate limiting doc upload rate max 3 docs per address for every 2 minutes',function(){
        let docHash_1 = "ff635631b30d2e777fe163f46ed76b398c06ff3c3ee1de335dfe1e30b14e4faf";
        let docHash_2 = "340fa3ff9bb3f74457255e241750a9e9e6a6c945cc6292a378a56efbdc53ac15";
        let docHash_3 = "094c8923cc85b2914c65315ae27d173aa20eca02f1bcab0e523206d0ee83a26a";
        let docHash_4 = "d54bfd00b4dea3abc3cbe210eff7fff6387d43c1a54c97f16a37154036d51fc9";
        let docTimestamp ="2018-08-15 09:30:00";
        let docOwnerName = "Santu";
        let account_one = accounts[1];

        return ProofOfOwnership.deployed().then(function(instance){
            // only 3 documents can be uploaded by a user with in 2 minutes time window
            // the fourth document should not be loaded in to blockchain
            instance.addDocument(docHash_1,docTimestamp,docOwnerName,{from:account_one});
            instance.addDocument(docHash_2,docTimestamp,docOwnerName,{from:account_one});
            instance.addDocument(docHash_3,docTimestamp,docOwnerName,{from:account_one});
            instance.addDocument(docHash_4,docTimestamp,docOwnerName,{from:account_one});
            return instance.fetchDocumentDetails.call(docHash_4,{from:account_one});
        }).then(function(result){
            //console.log(result);
            let expected = "";
            let actual = result[0];
            assert.equal( actual,expected,'contract should return empty string when a document does not exist in blockchain');
        })
    });

    it('test rate limiting document upload rate multiple documents by multiple users',function(){
        let docHash_1 = "ff635631b30d2e777fe163f46ed76b398c06ff3c3ee1de335dfe1e30b14e4faf";
        let docHash_2 = "340fa3ff9bb3f74457255e241750a9e9e6a6c945cc6292a378a56efbdc53ac15";
        let docHash_3 = "094c8923cc85b2914c65315ae27d173aa20eca02f1bcab0e523206d0ee83a26a";
        let docHash_4 = "d54bfd00b4dea3abc3cbe210eff7fff6387d43c1a54c97f16a37154036d51fc9";
        let docTimestamp ="2018-08-15 09:30:00";
        let docOwnerName = "Santu";
        let account_one = accounts[1];
        let account_two = accounts[2];
        let account_three = accounts[3];

        return ProofOfOwnership.deployed().then(function(instance){
            // only 3 documents can be uploaded by a user with in 2 minutes time window
            // the fourth document should not be loaded in to blockchain
            instance.addDocument(docHash_1,docTimestamp,docOwnerName,{from:account_one});
            instance.addDocument(docHash_2,docTimestamp,docOwnerName,{from:account_two});
            instance.addDocument(docHash_3,docTimestamp,docOwnerName,{from:account_three});
            instance.addDocument(docHash_4,docTimestamp,docOwnerName,{from:account_one});
            return instance.fetchDocumentDetails.call(docHash_3,{from:account_one});
        }).then(function(result){
            //console.log(result);
            let expected = docHash_3;
            let actual = result[0];
            assert.equal( actual,expected,'contract should return empty string when a document does not exist in blockchain');
        })
    });

    it('test isAdmin function true condition',function(){
        let owner = accounts[0];
        return ProofOfOwnership.deployed().then(instance=>{
            return instance.isAdmin.call(owner,{from:accounts[0]});
        }).then(result=>{
            let expected = true;
            let actual = result;
            assert.equal(actual,expected,"first account should be the a Admin");
        })
    });

    it('test isAdmin function false condition',function(){
        let owner = accounts[1];
        return ProofOfOwnership.deployed().then(instance=>{
            return instance.isAdmin.call(owner,{from:accounts[0]});
        }).then(result=>{
            let expected = false;
            let actual = result;
            assert.equal(actual,expected,"first account should be the a Admin");
        })
    });

    it('test assignAdminAccess to a new address',function(){
        let owner = accounts[0];
        let newAddress = accounts[1]
;        return ProofOfOwnership.deployed().then(instance=>{
            instance.assignAdminAccess(newAddress,{from:owner});
            return instance.isAdmin.call(newAddress,{from:newAddress});
        }).then(result=>{
            let expected = true;
            let actual = result;
            assert.equal(actual,expected,"new account should be granted admin previliges");
        })
    });

    it('test assignAdminAccess to an existing admin',function(){
        let owner = accounts[0];
        let newAddress = accounts[0]
;        return ProofOfOwnership.deployed().then(instance=>{
            instance.assignAdminAccess(newAddress,{from:owner});
            return instance.isAdmin.call(newAddress,{from:newAddress});
        }).then(result=>{
            let expected = true;
            let actual = result;
            assert.equal(actual,expected," account should not be granted admin previliges");
        })
    });

})

