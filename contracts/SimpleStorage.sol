pragma solidity ^0.4.18;

contract SimpleStorage {
  uint storedData;
    struct Owner {
        address addr;
        string name;
        string email;
        string documentId;
    }

    mapping( string => Owner) documents; 

  function addDocument(string _name, string _email, string _documentId) public returns(string,string,string){

    documents[_documentId] = Owner(msg.sender,_name,_email,_documentId);

    return(_name,_email,_documentId);

  }

  function getDocument(string _documentId) public view returns(string,string,string){
  
    Owner storage data = documents[_documentId];
    return(data.name,data.email,data.documentId);

  }


  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
