pragma solidity ^0.4.22;

import './Mortal.sol';
import './ProofDB.sol';

contract Proof is Mortal{
    
    address public storageDb;
    mapping(address => UserUsageCount) userUsage;
    uint public documentUploadPeriod = 120 seconds;
    uint public documentLimit = 2;
    bool private stopped = false;

    //Document upload actions. To be used for user throtling
    enum UploadChoices { UPLOAD_CNT_INCR, UPLOAD_CNT_RESET, UPLOAD_NO }
    UploadChoices uploadChoice;
    UploadChoices constant defaultUploadChoice = UploadChoices.UPLOAD_NO;

    //Document idenfiers alongwith ipfs has of the document
    struct Document {
        bytes32 docHash;
        uint docTimestamp;
        string ipfsHash;
    }

    //Maintain user usage count to implement throtlling
    struct UserUsageCount {
        uint uploadTime;
        uint count;
    }

    // Constructor initiated with the storage contract address.
    constructor(address _storageDb) public {
        owner = msg.sender;
        storageDb = _storageDb;
    }

    // Change the storage contract address. only owner can change the storage contract address.
    function setStorageDB(address _storageDb) public returns(bool){
        storageDb = _storageDb;
        return true;
    }

    //Events for logging
    event LogUploadDocument(address _addr,bytes32 _userName, bytes32 _dochash, uint _docTimestamp, bytes _ipfsHash, string _notes);
    event LogFallback(address _senderaddr,uint _value);

    //Modifiers
    modifier stopInEmergency {if (!stopped) _;}
    modifier onlyInEmergency {if (stopped) _;}
    
    //Circuit Breaker to pause the contract in case of Emergency
    function toggleContractActive() public 
    onlyOwner {
        stopped = !stopped;
    }

    // function to upload the document. It stores the data in storage contract.
    function uploadDocument(bytes32 _docHash, bytes32 _userName, bytes _ipfsHash,bytes _docTags) 
    public
    stopInEmergency 
    returns(bool) {
        //UserUsageCount storage userUploadStats = userUsage[msg.sender];
        //UploadChoices choice = verifyRateLimit(msg.sender);
        bool status;
        ProofDB proofDB = ProofDB(storageDb);
        UploadChoices choice = verifyRateLimit(msg.sender);

        if (choice == UploadChoices.UPLOAD_CNT_RESET) {
            status = proofDB.addDocument(msg.sender,_docHash,_userName,_ipfsHash,_docTags);
            userUsage[msg.sender].uploadTime = now;
            userUsage[msg.sender].count = 1;
            //Log document upload event
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp,_ipfsHash,"Upload Success - Throtling count reset");
        } else if (choice == UploadChoices.UPLOAD_CNT_INCR) {
            status = proofDB.addDocument(msg.sender,_docHash,_userName,_ipfsHash,_docTags);
            userUsage[msg.sender].count += 1;
            //Log document upload event
            emit LogUploadDocument(msg.sender, _userName,_docHash,block.timestamp,_ipfsHash,"Upload Success");
        } else if (choice == UploadChoices.UPLOAD_NO){
            emit LogUploadDocument(msg.sender, _userName,_docHash,block.timestamp,_ipfsHash,"Upload Not Success - Throtling limit exceeded");
        } else {
            return false;
        }
        return status;
    }
    
    //verify whether user exceeded rate limit assigned
    //function verifyRateLimit(address _addr, UserUsageCount _userUploadStats)
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


    // function to retrieve the document details.
    function fetchDocument(bytes32 _docHash) 
    public 
    view 
    returns(bytes32,bytes32,uint,bytes,bytes) {
        
        require(_docHash != 0x0, "Document Hash is mandatory");
        ProofDB proofDB = ProofDB(storageDb);
        bytes32 docHash;
        bytes32 userName;
        uint docTimestamp;
        bytes memory ipfsHash;
        bytes memory docTags;
        (docHash,userName,docTimestamp,ipfsHash,docTags) = proofDB.getDocument(msg.sender,_docHash);
        return(docHash,userName,docTimestamp,ipfsHash,docTags);
    }

    function fetchAllDocuments() 
    public 
    view 
    returns(bytes32[]){
        ProofDB proofDB = ProofDB(storageDb);
        bytes32[] memory docHashList = proofDB.fetchAllDocuments(msg.sender);
        return docHashList;
    }

    // Fallback method to prevet calls to with data and unknown functions to the contract.
    // This function is invoked when a call is made to the contrat with no matching function signature. 
    function () public payable {
        require(msg.data.length == 0,"Message Length is not zero");
        emit LogFallback(msg.sender,msg.value);
    }

    function greet() external pure returns(string){
        return "Hello, greet message"; 
    }

}
