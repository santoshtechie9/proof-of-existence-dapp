pragma solidity ^0.4.22;

import './Mortal.sol';

// Data is separated from the logic to implement upgradable design pattern
// The only purpose of this contract is to store and retrieve data.
/** @title ProofDB contract manages the data for this entire application. */
contract ProofDB  is Mortal {
    
    //Document idenfiers is a structure which sotres the documented related information
    struct Document {
        bytes32 docHash;
        bytes32 userName;
        uint docTimestamp;
        bytes ipfsHash;
        bytes docTags;
    }

    //To keep track of all the documents owned by a user
    struct User {
        address addr;
        bytes32[] documentList;
        mapping(bytes32 => Document) documentDetails;
    }

    //Maintain user usage count to implement throtlling
    struct UserUsageCount {
        uint uploadTime;
        uint count;
    }
    
    // List of state variables
    address[] public allowedContractsKeys;
    mapping(address => bool) allowedContracts;
    mapping( address => User )  users;
    mapping( address => bool )  admins;
    mapping( bytes32 => Document )  documents;
    bool public stopped = false;
    
    //Events for logging
    event LogFallback(address _senderaddr,uint _value);

    //Modifiers
    modifier stopInEmergency {if (!stopped) _;}
    modifier onlyInEmergency {if (stopped) _;}

     //Circuit Breaker to pause the contract in case of Emergency
    function toggleContractActive() public 
    onlyOwner {
        stopped = !stopped;
    }
    
    // modified to restric access to allowed users and contracts
    modifier onlyAllowedContractOrOwner {
        require (allowedContracts[msg.sender] != true && msg.sender != owner,"Should be a owner");
        _;
    }

    /** @dev addAllowedContractOrOwner. function to add allowed contracts or owners to the list.
        * The list of users have the previliges to execute methods that make changes to the state of this ProofDB.
        * @param _addr address of contract or user.
        * @return status true/false.
        */
    function addAllowedContractOrOwner(address _addr)
    public
    onlyOwner 
    returns(bool) {
        if( allowedContracts[_addr] == false ) {
            allowedContracts[_addr] = true;
            allowedContractsKeys.push(_addr);
            return true;
        }
        return false;
    }

    /** @dev isAllowedContractOrOwner. This function determines of an address is allowed to  make change to the state of ProofDB contract.
        * The list of users have the previliges to execute methods that make changes to the state of this ProofDB.
        * @param _addr address of contract or user.
        * @return status true/false.
        */
    function isAllowedContractOrOwner(address _addr)
    public
    view 
    returns(bool) {
        return allowedContracts[_addr];
    }
    
    /** @dev addDocument. This function adds a document to the data store. 
        * documents are maintained for each user. An array inside user struct contains all the document the user uploaded so far.
        * document struct contains the document details
        * @param caller documentId.
        * @param _docHash documentId.
        * @param _userName name of the owner.
        * @param _ipfsHash hash of the document returned by IPFS.
        * @param _docTags additional tags.
        * @return status true/false.
        */
    function addDocument(address caller, bytes32 _docHash, bytes32 _userName, bytes _ipfsHash,bytes _docTags) 
    public
    stopInEmergency
    returns(bool) {
        if(users[caller].documentDetails[_docHash].docHash == 0x0 ){
            users[caller].addr = msg.sender;
            users[caller].documentList.push(_docHash);
            users[caller].documentDetails[_docHash] = Document(_docHash, _userName,block.timestamp,_ipfsHash,_docTags);
            return true;
        }
        return false;
    }
    
    /** @dev getDocument. Returns details of a single document. address and  docHash are used to  look up a particular document.
        * @param caller user address.
        * @param _docHash unique documentId.
        * @return docHash unique documentId.
        * @return userName onwer name.
        * @return docTimestamp document registered timestamp.
        * @return ipfsHash hash of the document returned by IPFS.
        * @return docTags additional tags describing the document uploaded.
        */
    function getDocument(address caller,bytes32 _docHash) 
    public 
    view 
    returns(bytes32, bytes32, uint, bytes,bytes){
        require(_docHash != 0x0, "Document Hash is mandatory");
        Document storage document = users[caller].documentDetails[_docHash];
        return(document.docHash,document.userName,document.docTimestamp,document.ipfsHash,document.docTags);
    }
    
    /** @dev fetchAllDocuments. Returns all the documents that belong to the sender. 
        * @return documentList list of document addresses.
        */
    function fetchAllDocuments(address caller) 
    public 
    view 
    returns(bytes32[]){
        return users[caller].documentList;
    }
    
    /** @dev checkBalance. Checks the ether balance of the contract account. 
        * @return balance contract ether balance.
        */
    function checkBalance() public view returns(uint){
        return address(this).balance;
    }
    
    /** @dev withdrawFunds. Allows the owner to withdraw ether balance the contract account. 
        * pull over push for external calls.
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
