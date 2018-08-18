import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import DocumentDetailsCard from '../../components/Cards/DocumentDetailsCard/DocumentDetailsCard';
import DocumentPreviewCard from '../../components/Cards/DocumentPreviewCard/DocumentPreviewCard';
import VerificationForm from '../../components/Forms/VerificationForm/VerificationForm';
import WarningModal from '../../components/Modals/WarningModal';
import ProofOfOwnershipContract from '../../../build/contracts/ProofOfExistance.json';
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
        warning: false,
        info: false,
        contractResponse: {
            name: "",
            email: "",
            timestamp: "",
            isPresent: null
        }
    }


    toggle = () => {
        this.setState({
            info: !this.state.info,
        });
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
        console.log("Inside toggleInfo; info=" + !this.state.info)
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

        let file = e.target.files[0];
        let reader = new window.FileReader();

        console.log(file);
        console.log("FieldName=" + e.target.name);
        console.log("FieldValue=" + e.target.value);

        if (file) {
            reader.readAsArrayBuffer(file);
            // reader.readAsDataURL(file)
            reader.onloadend = () => {
                var md = forge.md.sha256.create();
                md.update(Buffer(reader.result));
                let digest = '0x' + md.digest().toHex();
                console.log("digest = " + digest);
                //console.log("reader result = " + reader.result);
                //Set the state variable here selected file name, imagePreviewURL and digest
                this.setState({ fileInput: file.name, imagePreviewUrl: Buffer(reader.result), digest: digest });
            }
        } else {
            console.log('There is no image file selected')
            //when the image is unselected reset the state variables
            this.setState({ fileInput: '', imagePreviewUrl: null });
        }
    }

    instantiateContract = () => {
        console.log("inside instantiateContract")
        const contract = require('truffle-contract')
        const pow = contract(ProofOfOwnershipContract)
        pow.setProvider(this.state.web3.currentProvider)

        // Declaring this for later so we can chain functions on pow.
        var powInstance

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {

            pow.deployed().then((instance) => {

                powInstance = instance;
                console.log(powInstance);
                return powInstance.fetchDocument.call(this.state.digest, { from: accounts[0] })

            }).then((result) => {
                // Get the value from the contract to prove it worked.
                console.log("final result");
                console.log("Verify: Instatiate Contract: result", result);

                if (result[0] != 0x0) {
                    console.log("result state set")
                    return this.setState({ contractResponse: { hash: result[0], timestamp: result[1].valueOf(), ipfsHash: result[2], name: "userName",email:"abc@abc.com", isPresent: true }, warning: true });
                } else {
                    console.log("result2 = empty")
                    return this.setState({ contractResponse: { hash: result[0], timestamp: result[1], ipfsHash: result[2], name: "userName",email:"abc@abc.com", isPresent: false }, warning: true })
                }
            }).catch(error => {
                console.log("----------error---------")
                console.log(error)
                window.alert(error)
            })
        })
    }

    render() {

        let imagePreviewUrl = this.state.imagePreviewUrl;
        let $imagePreview = null;
        console.log("at line 154")
        console.log(this.state);
        let ipfsUrl = null;

        if (imagePreviewUrl !== null && this.state.contractResponse.isPresent === true) {
            console.log("Document exists in blockchain")
            console.log("ipfsHash : ", this.state.contractResponse.ipfsHash);
            if (this.state.contractResponse.ipfsHash) {
                console.log("setting ipfs URL")
                ipfsUrl = 'https://ipfs.infura.io/ipfs/' + this.state.contractResponse.ipfsHash;
            }
            console.log('ipfsUrl : ' + ipfsUrl);
            console.log(this.state.fileInput)
            $imagePreview = (
                <div>
                    <DocumentPreviewCard fileBuffer={ipfsUrl} />
                    <DocumentDetailsCard
                        fileInput={this.state.contractResponse.fileInput}
                        name={this.state.contractResponse.name}
                        email={this.state.contractResponse.email}
                        timestamp={this.state.contractResponse.timestamp}
                        docHash={this.state.contractResponse.hash}
                        ipfsHash={this.state.contractResponse.ipfsHash} />
                </div>
            );
        } else {
            if (this.state.contractResponse.isPresent === false) {
                console.log("Document does not exist in blockchain")
                console.log(this.state);
                console.log("blockchainDigest=" + this.state.blockchainDigest);
                console.log("imagePreviewUrl=" + this.state.imagePreviewUrl);
                $imagePreview = (
                    <WarningModal
                        warning={this.state.warning}
                        toggleWarning={this.toggleWarning}
                        message="The document doesnot exist in blockchain"
                    />);
            }
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