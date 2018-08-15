var ProofOfOwnership = artifacts.require('ProofOfOwnership.sol')

contract('Test ProofOfOwnership', function(accounts){
    
    it('Test add document function',function(){
        return ProofOfOwnership.deployed().then(function(instance){
            //console.log(instance);
            instance.addDocument("document1","2018-07-30 09:30:00","sans",{from:accounts[0]});
            return instance.fetchDocumentDetails.call("document1",{from:accounts[0]});
        }).then(function(result){
            //console.log(result);
            let expected = "document1";
            let actual = result[0];
            assert.equal( actual,expected,'the function should return true');
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

