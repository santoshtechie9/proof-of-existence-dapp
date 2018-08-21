pragma solidity ^0.4.22;

import './ProofDB.sol';

contract ProofLogic{
    
    address owner;
    address storageDb;
    uint documentUploadPeriod = 120 seconds;
    uint documentLimit = 3;
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
    event LogUploadDocument(address _addr,string _userName, bytes32 _dochash, uint _docTimestamp, string _ipfsHash, string _notes);
    event LogAssignAdmin(address _sender, string _message);
    
    //Modifiers
    modifier onlyOwner(){require(msg.sender == owner, "msg sender is not owner"); _;}
    modifier stopInEmergency {if (!stopped) _;}
    modifier onlyInEmergency {if (stopped) _;}
    
    //Circuit Breaker to pause the contract in case of Emergency
    function toggleContractActive() public 
    onlyOwner {
        stopped = !stopped;
    }

    // function to upload the document. It stores the data in storage contract.
    function uploadDocument(bytes32 _docHash, string _userName, string _ipfsHash) 
    public
    stopInEmergency 
    returns(bool) {
        //UserUsageCount storage userUploadStats = usersUsage[msg.sender];
        //UploadChoices choice = verifyRateLimit(msg.sender);

        ProofDB proofDB = ProofDB(storageDb);
        bool status = proofDB.addDocument(msg.sender,_docHash,_userName,_ipfsHash);
        return status;
    }
    
    // function to retrieve the document details.
    function fetchDocument(bytes32 _docHash) 
    public  
    returns(bytes32,string,uint,string) {
        ProofDB proofDB = ProofDB(storageDb);
        bytes32 docHash;
        string memory userName;
        uint docTimestamp;
        string memory ipfsHash;
        (docHash,userName,docTimestamp,ipfsHash) = proofDB.getDocument(msg.sender,_docHash);
        emit LogUploadDocument(msg.sender,userName,docHash, docTimestamp,ipfsHash, "Doc Fetch Req");
        return(docHash,userName,docTimestamp,ipfsHash);
    }

    function fetchAllDocuments() 
    public 
    view 
    returns(bytes32[]){
        ProofDB proofDB = ProofDB(storageDb);
        bytes32[] memory docHashList = proofDB.fetchAllDocuments(msg.sender);
        return docHashList;
    }

    function greet() public pure returns(string){
        return "Hello, greet message"; 
    }

}
