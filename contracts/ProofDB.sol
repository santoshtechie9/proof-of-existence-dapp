pragma solidity ^0.4.22;

contract ProofDB {
    
    //Document idenfiers alongwith ipfs has of the document
    struct Document {
        bytes32 docHash;
        uint docTimestamp;
        string ipfsHash;
    }

    //To keep track of all the documents owned by a user
    struct User {
        address addr;
        string userName;
        bytes32[] documentList;
        mapping(bytes32 => Document) documentDetails;
        //uint lastUploadTimestamp;
    }

    //Maintain user usage count to implement throtlling
    struct UserUsageCount {
        uint uploadTime;
        uint count;
    }
    
    address public owner;
    address[] public allowedContractsKeys;
    mapping(address => bool) public allowedContracts;
    mapping( address => User )  users;
    mapping( address => bool )  admins;
    mapping( string => Document )  documents;
    bytes32 public documentHash;
    
    modifier onlyAllowedContractOrOwner {
        require (allowedContracts[msg.sender] != true && msg.sender != owner,"Should be a owner");
        _;
    }
    
    function addDocument(address caller, bytes32 _docHash, string _userName, string _ipfsHash) 
    public
    returns(bool) {
        users[caller].addr = msg.sender;
        users[caller].userName = _userName;
        users[caller].documentList.push(_docHash);
        users[caller].documentDetails[_docHash] = Document(_docHash, block.timestamp,_ipfsHash);
        documentHash = _docHash;
        return true;
    }
    
    function getDocument(address caller,bytes32 _docHash) 
    public 
    view 
    returns(bytes32, string, uint, string){
        require(_docHash != 0x0, "Document Hash is mandatory");
        Document storage document = users[caller].documentDetails[_docHash];
        return(document.docHash,users[caller].userName,document.docTimestamp,document.ipfsHash);
    }
    
    function fetchAllDocuments(address caller) 
    public 
    view 
    returns(bytes32[]){
        return users[caller].documentList;
    }
    
    mapping( address => UserUsageCount ) userUsage;

    function setUserUsage(address caller,uint _uploadTime,uint _count) 
    public 
    returns(bool){
        userUsage[caller].uploadTime = _uploadTime;
        userUsage[caller].count = _count;
        return true;
    }

    function getUserUsage(address caller)
    public
    view 
    returns(uint,uint){
        return(userUsage[caller].uploadTime,userUsage[caller].count);
    }

}   
