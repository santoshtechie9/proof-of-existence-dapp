import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import forge from 'node-forge';
import BasicForm from '../../components/Forms/BasicForm/BasicForm';
import DocumentDetailsCard from '../../components/Cards/DocumentDetailsCard/DocumentDetailsCard';
import DocumentPreviewCard from '../../components/Cards/DocumentPreviewCard/DocumentPreviewCard';
import SimpleStorageContract from '../../../build/contracts/SimpleStorage.json';
import getWeb3 from '../../utils/getWeb3';

class Notarize extends Component {

    state = {
        storageValue: 0,
        web3: null,
        name: '',
        email: '',
        dateInput: '',
        textAreaInput: '',
        fileInput: '',
        imagePreviewUrl: '',
        digest:''
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
    
        getWeb3
          .then(results => {
            this.setState({
              web3: results.web3
            })
    
            // Instantiate contract once web3 provided.
            //this.instantiateContract()
          })
          .catch(() => {
            console.log('Error finding web3.')
          })
      }

    handleSubmit = (event) => {
        console.log("Clicked on Submit button ");
        console.log(this.state);
        this.instantiateContract();
    }


    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        console.log("name=" + name);
        console.log("value=" + value);

        if (name !== "fileInput" && value.length !== 0) {
            this.setState({ [name]: value });
        } else {
            console.log("empty data nothing to set")
        }
    }

    handleImageChange = (e) => {
        e.preventDefault();
        console.log("inside _handleImageChange ")

        let reader = new FileReader();
        let file = e.target.files[0];

        console.log(file);
        console.log("name=" + e.target.name);
        console.log("value=" + e.target.value);
        
        if (file) {
            reader.onloadend = () => {
                var md = forge.md.sha256.create();
                md.update(reader.result);
                let digest = md.digest().toHex();       
                console.log(digest);
                console.log(reader.result);
                this.setState({ fileInput: file.name, imagePreviewUrl: reader.result,digest:digest});
            }
            reader.readAsDataURL(file)
        } else {
            console.log('There is no image file selected')
            this.setState({ fileInput: '', imagePreviewUrl: '' });
        }
    }

    instantiateContract =() => {
        /*
         * SMART CONTRACT EXAMPLE
         *
         * Normally these functions would be called in the context of a
         * state management library, but for convenience I've placed them here.
         */
    
        const contract = require('truffle-contract')
        const simpleStorage = contract(SimpleStorageContract)
        simpleStorage.setProvider(this.state.web3.currentProvider)
    
        // Declaring this for later so we can chain functions on SimpleStorage.
        var simpleStorageInstance
    
        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
    
          simpleStorage.deployed().then((instance) => {
            simpleStorageInstance = instance;
    
            // Stores a given value, 5 by default.
            //return simpleStorageInstance.set(5, { from: accounts[0] })
            return simpleStorageInstance.addDocument(this.state.name,this.state.email,this.state.digest,{from:accounts[0]})
    
          }).then((result) => {
            // Get the value from the contract to prove it worked.
            console.log(result);
            return simpleStorageInstance.getDocument.call(this.state.digest,{from:accounts[0]})
          }).then((result) => {
            // Update state with the result.
            console.log("final result");
            console.log(result);
            return this.setState({ storageValue: result.c[0] })
          })
        })
      }
    

    render() {

        const prefill = {
            imageFileName: "ProfileImage.jpg",
            name: "John Doe",
            email: "name@example.com",
            dateFormat: "dd/yy/mm",
            textArea: "Enter text here"
        }

        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;

        if (imagePreviewUrl) {
            console.log("Document has been selected")
            console.log(this.state.fileInput)
            $imagePreview = (
                <div>
                    <DocumentPreviewCard imagePreviewUrl={this.state.imagePreviewUrl} />
                    <DocumentDetailsCard
                        fileInput={this.state.fileInput}
                        name={this.state.name}
                        email={this.state.email}
                        timestamp={this.state.dateInput}
                        digest={this.state.digest} />
                </div>
            );
        }

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col xs="12" md="6" xl="6">
                            <BasicForm
                                name={prefill.name}
                                handleSubmit={this.handleSubmit}
                                handleChange={this.handleChange}
                                handleImageChange={this.handleImageChange} />
                        </Col >
                        <Col xs="12" md="6" xl="6">
                            {$imagePreview}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Notarize;