pragma solidity ^0.4.22;

import './Mortal.sol';
import './ProofDB.sol';

/** @title Proof. */
contract Proof is Mortal{
    
    address public storageDb;
    mapping(address => UserUsageCount) userUsage;
    uint public documentUploadPeriod = 180 seconds;
    uint public documentLimit = 3;
    bool public stopped = false;

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

    /** @dev uploadDocument. Function to upload the document. It stores the data in storage contract. 
        * @param _docHash documentId.
        * @param _userName name of the owner.
        * @param _ipfsHash hash of the document returned by IPFS.
        * @param _docTags additional tags.
        * @return status true/false.
        */
    function uploadDocument(bytes32 _docHash, bytes32 _userName, bytes _ipfsHash,bytes _docTags) 
    public
    stopInEmergency 
    returns(bool) {
        
        require(_docHash != 0x0,"Document hash is mandatory it can't be 0x0");
        require(_userName.length <= 32,"userName should be <= 32 bytes");
        require(_ipfsHash.length <= 64,"ipfsHash should be <= 64 bytes");
        require(_docTags.length <= 32,"docTags should be <= 32 bytes");
        
        bool status;
        ProofDB proofDB = ProofDB(storageDb);
        UploadChoices choice = verifyRateLimit(msg.sender);

        if (choice == UploadChoices.UPLOAD_CNT_RESET) {
            userUsage[msg.sender].uploadTime = now;
            userUsage[msg.sender].count = 1;
            status = proofDB.addDocument(msg.sender,_docHash,_userName,_ipfsHash,_docTags);
            //Log document upload event
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp,_ipfsHash,"uploaded - throtling count reset");
        } else if (choice == UploadChoices.UPLOAD_CNT_INCR) {
            userUsage[msg.sender].count += 1;
            status = proofDB.addDocument(msg.sender,_docHash,_userName,_ipfsHash,_docTags);
            //Log document upload event
            emit LogUploadDocument(msg.sender, _userName,_docHash,block.timestamp,_ipfsHash,"upload");
        } else if (choice == UploadChoices.UPLOAD_NO){
            emit LogUploadDocument(msg.sender, _userName,_docHash,block.timestamp,_ipfsHash,"upload failed - throtling limit exceeded");
        } else {
            return false;
        }
        return status;
    }
    
    /** @dev verifyRateLimit. Verify whether user exceeded rate limit assigned. 
        * @param _addr address of the user.
        * @return uploadChoices constant.
        */
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

    /** @dev fetchDocument. function to retrieve the document details.
        * @param _docHash unique documentId.
        * @return docHash unique documentId.
        * @return userName onwer name.
        * @return docTimestamp document registered timestamp.
        * @return ipfsHash hash of the document returned by IPFS.
        * @return docTags additional tags describing the document uploaded.
        */
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

    /** @dev fetchAllDocuments. Returns all the documents that belong to the sender. 
        * @return docHashList list of document addresses.
        */
    function fetchAllDocuments() 
    public 
    view 
    returns(bytes32[]){
        ProofDB proofDB = ProofDB(storageDb);
        bytes32[] memory docHashList = proofDB.fetchAllDocuments(msg.sender);
        return docHashList;
    }

    /** @dev checkBalance. Checks the ether balance of the contract account. 
        * @return balance contract ether balance.
        */
    function checkBalance() public view returns(uint){
        return address(this).balance;
    }

    /** @dev withdrawFunds. Allows the owner to withdraw ether balance the contract account. 
        * @return status true/false.
        */
    function withdrawFunds() public 
    onlyOwner 
    onlyInEmergency
    returns(bool){
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
        return true;
    }

    // Fallback method to prevet calls to with data and unknown functions to the contract.
    // This function is invoked when a call is made to the contrat with no matching function signature. 
    function () public payable {
        require(msg.data.length == 0,"Message Length is not zero");
        emit LogFallback(msg.sender,msg.value);
    }

}
