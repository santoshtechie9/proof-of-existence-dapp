pragma solidity ^0.4.18;

contract ProofOfOwnership {

    struct Document {
        address owner;
        string ownerName;
        string ownerEmail;
        string docTimestamp;
        string docHash;
    }
    
    mapping( string => Document) documents; 

    function addNewDocument(string _ownerName, string _ownerEmail, string _docTimestamp, string _docHash) public returns(bool){
        documents[_docHash] = Document(msg.sender,_ownerName,_ownerEmail,_docTimestamp,_docHash);
        return(true);
    }

    function getDocumentDetails(string _documentId) public view returns(string,string,string,string){
        Document storage document = documents[_documentId];
        return(document.ownerName,document.ownerEmail,document.docTimestamp,document.docHash);
    }

}