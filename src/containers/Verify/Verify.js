import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import DocumentDetailsCard from '../../components/Cards/DocumentDetailsCard/DocumentDetailsCard';
import DocumentPreviewCard from '../../components/Cards/DocumentPreviewCard/DocumentPreviewCard';
import VerificationForm from '../../components/Forms/VerificationForm/VerificationForm';
import InfoModal from '../../components/Modals/InfoModal';
import SimpleStorageContract from '../../../build/contracts/SimpleStorage.json';
import getWeb3 from '../../utils/getWeb3';
import forge from 'node-forge';

class Verify extends Component {

    state = {
        storageValue: 0,
        web3: null,
        name: '',
        email: '',
        dateInput: '',
        textAreaInput: '',
        fileInput: '',
        imagePreviewUrl: null,
        digest: '',
        blockchainDigest: '',
        success: false,
        danger: false,
        info: false,
    }

    toggleSuccess = () => {
        this.setState({
            success: !this.state.success,
        });
    }

    toggleWarning = () => {
        this.setState({
            warning: !this.state.warning,
        });
    }

    toggleInfo = (e) => {
        e.preventDefault();
        console.log("Inside toggleInfo; info="  + !this.state.info)
        this.setState({
            info: !this.state.info,
        });
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

    handleReset = () => {
        console.log("Inside handleReset ")
        document.getElementById("document-verification-form").reset();
        this.setState({ name: '', email: '', dateInput: '', textAreaInput: '', fileInput: '', imagePreviewUrl: '', digest: '', blockchainDigest: '' });
        console.log(this.state)
    }

    handleSubmit = (event) => {
        console.log("Clicked on Submit button ");
        console.log(this.state);
        this.instantiateContract();
    }

    handleImageChange = (e) => {

        e.preventDefault();
        console.log("inside handleImageChange funtion")

        let reader = new FileReader();
        let file = e.target.files[0];

        console.log(file);
        console.log("FieldName=" + e.target.name);
        console.log("FieldValue=" + e.target.value);

        if (file) {
            reader.onloadend = () => {
                var md = forge.md.sha256.create();
                md.update(reader.result);
                let digest = md.digest().toHex();
                console.log("digest = " + digest);
                //console.log("reader result = " + reader.result);
                //Set the state variable here selected file name, imagePreviewURL and digest
                this.setState({ fileInput: file.name, imagePreviewUrl: reader.result, digest: digest });
            }
            reader.readAsDataURL(file)
        } else {
            console.log('There is no image file selected')
            //when the image is unselected reset the state variables
            this.setState({ fileInput: '', imagePreviewUrl: null });
        }
    }

    instantiateContract = () => {
        /*
         * SMART CONTRACT EXAMPLE
         *
         * Normally these functions would be called in the context of a
         * state management library, but for convenience I've placed them here.
         */
        console.log("inside instantiateContract")
        const contract = require('truffle-contract')
        const simpleStorage = contract(SimpleStorageContract)
        simpleStorage.setProvider(this.state.web3.currentProvider)

        // Declaring this for later so we can chain functions on SimpleStorage.
        var simpleStorageInstance

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {

            simpleStorage.deployed().then((instance) => {

                simpleStorageInstance = instance;
                console.log(simpleStorageInstance);
                // Stores a given value, 5 by default.
                //return simpleStorageInstance.set(5, { from: accounts[0] })
                // return simpleStorageInstance.addDocument(this.state.name, this.state.email, this.state.digest, { from: accounts[0] })
                return simpleStorageInstance.getDocument.call(this.state.digest, { from: accounts[0] })

            }).then((result) => {
                // Get the value from the contract to prove it worked.
                console.log("final result");
                console.log(result);
                console.log(result[0]);
                console.log(result[1]);
                console.log(result[2]);
                return this.setState({ name: result[0], email: result[1], blockchainDigest: result[2] })
            })
        })
    }

    render() {

        let imagePreviewUrl = this.state.imagePreviewUrl;
        let blockchainDigest = this.state.blockchainDigest;
        let $imagePreview = null;
        console.log("at line 154")
        console.log(this.state);
       
        if (imagePreviewUrl!==null && blockchainDigest !== '') {
            console.log("Document exists in blockchain")
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
        } else if (this.state.info === true && blockchainDigest === '' && imagePreviewUrl !==null) {
            console.log("Document does not exist in blockchain")
            console.log("blockchainDigest=" +this.state.blockchainDigest);
            console.log("imagePreviewUrl=" +this.state.imagePreviewUrl);
            $imagePreview = (
                <InfoModal
                    info={!this.state.info}
                    toggleInfo={this.toggleInfo}
                />);
        }

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col xs="12" md="6" xl="6">
                            <VerificationForm
                                handleImageChange={this.handleImageChange}
                                handleSubmit={this.handleSubmit}
                                handleReset={this.handleReset} />
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

export default Verify;