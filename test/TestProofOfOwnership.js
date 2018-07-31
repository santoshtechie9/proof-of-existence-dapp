
var ProofOfOwnership = artifacts.require('ProofOfOwnership.sol')

contract('Test ProofOfOwnership', function(accounts){

    it('Test add document function',function(){

        return ProofOfOwnership.deployed().then(function(instance){
            //console.log(instance);
            instance.addNewDocument("sans","sans@gmail.com","2018-07-30 09:30:00","document1",{from:accounts[0]});
            return instance.getDocumentDetails.call("document1",{from:accounts[0]});
        }).then(function(result){
            //console.log(result);
            let expected = "document1";
            let returned = result[3];
            assert.equal(expected, returned,'the function should return true');
        })

    })


})

