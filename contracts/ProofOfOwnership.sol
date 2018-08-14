pragma solidity ^0.4.22;

import './Mortal.sol';

contract ProofOfOwnership is Mortal {
    
    mapping(address => bool) admins;
    mapping( string => Document) documents;
    mapping(address => UserUsageCount) usersUsage;
    uint documentUploadPeriod = 120 seconds;
    uint documentLimit = 3;
    //uint circuitBreakerThreshold = 10;
    //uint circuitBreakercounter = 0;
    bool private stopped = false;
    
    struct UserUsageCount {
        uint time;
        uint count;
    }
    
    struct Document {
        string docHash;
        string docTimestamp;
        string currentOwnerName;
        address currentOwnerAddress;
    }

    event LogDocumentUpload(string _docHash, address _sender, uint _counter, string _message);
    event LogFallback(string _message, address _sender,uint _value);
    event LogAssignAdmin(address _sender, string _message);
    
    modifier onlyOwner(){ require(msg.sender == owner, "msg sender is not owner"); _; }
    modifier onlyAdmin(){require(admins[msg.sender] == true,"sender is not Admin"); _; }
    modifier stopInEmergency { if (!stopped) _; }
    modifier onlyInEmergency { if (stopped) _; }
    
    
    constructor() public {
        admins[msg.sender] = true;
    }
    
    function toggleContractActive() onlyAdmin public {
            stopped = !stopped;
    }


    function assignAdminAccess(address _address) public 
    onlyOwner 
    returns(bool){
        if(admins[_address] == false){
            admins[_address] = true;
            emit LogAssignAdmin(_address,"assigned admin previlige");
            return true;
        }else{
            emit LogAssignAdmin(_address,"is already admin");
            return false;
        }
    }

    function revokeAdminAccess(address _address) public 
    onlyOwner 
    returns(bool){
        if(admins[_address] == true){
            // admins[_address];
            delete admins[_address];
            emit LogAssignAdmin(_address,"revoked admin previlige");
            return true;
        }else{
            emit LogAssignAdmin(_address,"This address do not have admin previlige");
            return false;
        }
    }

    function isAdmin(address _address) public view returns(bool){
        if(admins[_address] == true){
            return true;
        }else {
            return false;
        }
    }

    function addDocument(string _docHash, string _docTimestamp, string _currentOwnerName) public stopInEmergency  returns(bool){
       
       //Input paramenters validation
       //Document hash should not be empty and length should 256 bytes
       
        UserUsageCount storage userUploadStats = usersUsage[msg.sender];
        
        if(now >= userUploadStats.time + documentUploadPeriod){
            documents[_docHash] = Document(_docHash, _docTimestamp, _currentOwnerName, msg.sender);
            usersUsage[msg.sender].time = now;
            usersUsage[msg.sender].count = 1;
            emit LogDocumentUpload(_docHash,msg.sender,usersUsage[msg.sender].count,"document uploaded succesfully");
        } else {
            
            if(userUploadStats.count >= documentLimit){
                emit LogDocumentUpload(_docHash,msg.sender,usersUsage[msg.sender].count,"document upload failed");
                //circuitBreakercounter += 2;
                return false;
            }else{
                documents[_docHash] = Document(_docHash, _docTimestamp, _currentOwnerName, msg.sender);
                usersUsage[msg.sender].count += 1;
                emit LogDocumentUpload(_docHash,msg.sender,usersUsage[msg.sender].count,"document uploaded succesfully");
            }
        
        }

        return(true);
    }
    
    function fetchDocumentDetails(string _docHash) public view returns(string,string,string){
           
        Document storage document = documents[_docHash];
        //require(document);
        return(document.docHash,document.docTimestamp,document.currentOwnerName);
    }
    
    
    //this method will let he owner withdraw funds sent to the contract account.
   /*
   
    function withdrawFunds() public 
    onlyOwner 
    onlyInEmergency
    returns(bool){
        uint balance = address(this).balance;
        //require(balance > 0,"contract balance is zero");
        //owner.transfer(balance);
        msg.sender.transfer(balance);
        return true;
    }
    
    function checkBalance() public view returns(uint) {
        return address(this).balance;
    }
*/
    //fallback function logs the 
   // function () public payable {
   //     emit LogFallback("value received from", msg.sender,msg.value);
  //  }

}