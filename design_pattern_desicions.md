# Design Patterns

## Introduction
This document gives an overview of the design patterns used to implement the application. Please go through the following section for more details.

## Fail early and fail loud
All the functions that modify the state of the contract have checks on the input variables. All the input variales are validate at the beginning of the functions. If any of the input variables fails the contract with revert state and throw and application at the early stage.

```
    // function to upload the document. It stores the data in storage contract.
    function uploadDocument(bytes32 _docHash, bytes32 _userName, bytes _ipfsHash,bytes _docTags) 
    public
    stopInEmergency 
    returns(bool) {
        //UserUsageCount storage userUploadStats = userUsage[msg.sender];
        //UploadChoices choice = verifyRateLimit(msg.sender);
        
        require(_docHash != 0x0,"Document hash is mandatory it can't be 0x0");
        require(_userName.length <= 32,"userName should be <= 32 bytes");
        require(_ipfsHash.length <= 64,"ipfsHash should be <= 64 bytes");
        require(_docTags.length <= 32,"docTags should be <= 32 bytes");
        
        bool status;
        ProofDB proofDB = ProofDB(storageDb);
        UploadChoices choice = verifyRateLimit(msg.sender);

    }
```

## Mortal

Mortal design pattern allows the owner to kill the contract and transfer any ether balance in the contract to owner account. This design patters in implemented in Mortal.sol and is inherited by all the other contracts.

```
    function kill() public 
    onlyOwner{
        require(msg.sender == owner,"message sender is not owner");
        selfdestruct(owner);
    }
```

## Restricting Access

Restricts the access to certain methods. only the owner of the contract will be able to perform these operations.

```
    // Owned contract to assign a owner at the time of deployment
    contract Owned {
    
        address public owner;

        // Modifier to check if the sender is owner    
        modifier onlyOwner(){
        require(msg.sender == owner, "msg sender is not owner");
        _;
    }
   
    constructor() public {
        owner = msg.sender;
    }

```

## Circuit Breaker

Circuit breaker design pattern allows to pause the contract or dapp in emergency situation. It is implemented in Proof.sol contract.

```
    bool private stopped = false;
    //Modifiers
    modifier stopInEmergency {if (!stopped) _;}
    modifier onlyInEmergency {if (stopped) _;}
```

## Rate Limiting

The number of documents a user can upload to the app is restricted to 3 documents/ 3 minutes. This is acheived by implementing rate limiting design pattern in Proof.sol contract. 

```
    function verifyRateLimit(address _addr)
    private
    view
    returns(UploadChoices) {
        //Do not like the duplication here, but get a compilation error if I pass it to this function
        UserUsageCount storage _userUploadStats = userUsage[_addr];
        if(block.timestamp >= _userUploadStats.uploadTime + documentUploadPeriod){
            return UploadChoices.UPLOAD_CNT_RESET;
        } else {
            if(_userUploadStats.count >= documentLimit){
                return UploadChoices.UPLOAD_NO;
            }else{
                return UploadChoices.UPLOAD_CNT_INCR;
            }
        }
        return defaultUploadChoice;
    }
```

## Upgrading contracts

Upgradable design pattern allows the owner to upgrade the contracts. It is implemented in Registed.sol, Proof.sol, ProofDB.sol contracts.

```
    contract Register is Mortal {
        
        address backendContract;
        address[] public previousBackends;
        
        // event to log the current version of the contract
        event LogCurrentVersion(address _address);
        
        // Modifier to restrict access.
        // Only owner will be able to change the current version of the contract
        modifier onlyOwner() {
            require(msg.sender == owner,"Sender is not owner");
            _;
        }
        
        // Constructor accepts the intial versioin of the contract address 
        constructor(address initAddr) public {
            backendContract = initAddr;
            owner = msg.sender;
        }
        
        // Function to chang the current version of the contract address
        // Only owner can access execute this function to the version of smart contract
        function changeContractVersion(address _newBackend) public
        onlyOwner()
        returns (bool)
        {
            if(_newBackend != backendContract) {
                previousBackends.push(backendContract);
                backendContract = _newBackend;
                return true;
            }
            emit LogCurrentVersion(backendContract);
            return false;
        }
        
        // This function returns the current version of the smart contrace
        function getCurrentVersion() public view returns(address){
            return backendContract;
        }
        
    }
```

## pull over push

Proof.sol and ProofDB.sol databases have a withdrawFunds method. When invoked by the contract owner it will transfer the balance ether to the owner account. 

```
    // this method will allow the owner to withdraw funds sent to the contract account.
    // pull over push for external calls
    function withdrawFunds() public 
    onlyOwner 
    onlyInEmergency
    returns(bool){
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
        return true;
    }
```
