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
    event LogUploadDocument(address _addr,string _userName, bytes32 _dochash, uint _docTimestamp, string _ipfsHash, string _notes);
    
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
        //UserUsageCount storage userUploadStats = userUsage[msg.sender];
        //UploadChoices choice = verifyRateLimit(msg.sender);
        bool status;
        ProofDB proofDB = ProofDB(storageDb);
        UploadChoices choice = verifyRateLimit(msg.sender);

        if (choice == UploadChoices.UPLOAD_CNT_RESET) {
            status = proofDB.addDocument(msg.sender,_docHash,_userName,_ipfsHash);
            userUsage[msg.sender].uploadTime = now;
            userUsage[msg.sender].count = 1;
            //Log document upload event
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp, _ipfsHash, "Upload Success - Throtling count reset");
        } else if (choice == UploadChoices.UPLOAD_CNT_INCR) {
            status = proofDB.addDocument(msg.sender,_docHash,_userName,_ipfsHash);
            userUsage[msg.sender].count += 1;
            //Log document upload event
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp, _ipfsHash, "Upload Success");
        } else if (choice == UploadChoices.UPLOAD_NO){
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp, _ipfsHash, "Upload Not Success - Throtling limit exceeded");
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
    returns(bytes32,string,uint,string) {
        
        require(_docHash != 0, "Document Hash is mandatory");
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
