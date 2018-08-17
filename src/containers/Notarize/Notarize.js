import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import forge from 'node-forge';
import BasicForm from '../../components/Forms/BasicForm/BasicForm';
import DocumentDetailsCard from '../../components/Cards/DocumentDetailsCard/DocumentDetailsCard';
import DocumentPreviewCard from '../../components/Cards/DocumentPreviewCard/DocumentPreviewCard';
import WarningModal from '../../components/Modals/WarningModal';
//import ProofOfOwnershipContract from '../../../build/contracts/ProofOfOwnership.json';
import ProofOfOwnershipContract from '../../../build/contracts/ProofOfExistance.json';
import getWeb3 from '../../utils/getWeb3';
import ipfs from '../../ipfs/ipfs';

class Notarize extends Component {

    state = {
        storageValue: 0,
        web3: null,
        name: '',
        email: '',
        dateInput: '',
        textAreaInput: '',
        fileInput: '',
        fileBuffer: '',
        digest: '',
        isUploaded: false
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        console.log("componentWillMount Notarize")

        getWeb3
            .then(results => {
                const publicAddress = results.web3.eth.coinbase.toLowerCase()
                console.log(" componentWillMount Notarize this: ", this)
                this.setState({
                    web3: results.web3,
                    loading: true,
                    publicAddress: publicAddress
                })
                // Instantiate contract once web3 provided.
                //this.instantiateContract()
                console.log("ipfs =", ipfs);
                this.instantiateContract();
            })
            .catch(() => {
                console.log('Error finding web3.')
            });


    }

    toggleWarning = () => {
        this.setState({
            warning: !this.state.warning,
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("Clicked on Submit button ");
        console.log(this.state);

        ipfs.files.add(this.state.fileBuffer, (error, result) => {
            if (error) {
                console.error(error);
                return;
            }

            console.log('digest: ', this.state.digest);
            console.log('name: :', this.state.name);
            console.log('ipfsHash: ', result[0].hash);
            console.log('account: ', this.state.account);
            this.powInstance.uploadDocument(this.state.digest, this.state.name, result[0].hash, { from: this.state.account });
            this.powInstance.fetchDocument.call(this.state.digest, { from: this.state.account }).then(result => {
                console.log(result);
            })
            this.setState({ ipfsHash: result[0].hash });
            console.log('ipfsHash: ', this.state.ipfsHash);
        });

        console.log("file has been uploaded to IPFS")
        //this.instantiateContract();
    }


    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        //console.log("name=" + name);
        //console.log("value=" + value);

        if (name !== "fileInput" && value.length !== 0) {
            this.setState({ [name]: value });
        } else {
            console.log("empty data nothing to set")
        }
    }

    handleImageChange = (e) => {
        e.preventDefault();
        console.log("inside _handleImageChange ")

        let file = e.target.files[0];
        let reader = new window.FileReader();

        console.log(file);
        console.log("name=" + e.target.name);
        console.log("value=" + e.target.value);

        if (file) {
            //reader.readAsDataURL(file)
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                var md = forge.md.sha256.create();
                md.update(Buffer(reader.result));
                let digest = '0x' + md.digest().toHex();
                console.log("digest: ", digest);
                //console.log(reader.result);
                this.setState({ fileInput: file.name, fileBuffer: Buffer(reader.result), digest: digest });
                console.log('buffer:', this.state.fileBuffer);
                var docHash = digest;
                console.log("docHash: " + docHash);
            }

        } else {
            console.log('There is no image file selected')
            this.setState({ fileInput: '', fileBuffer: '' });
        }

        console.log(this.state.fileBuffer);

    }

    instantiateContract = () => {
        /*
         * SMART CONTRACT EXAMPLE
         *
         * Normally these functions would be called in the context of a
         * state management library, but for convenience I've placed them here.
         */

        const contract = require('truffle-contract')
        const pow = contract(ProofOfOwnershipContract)
        pow.setProvider(this.state.web3.currentProvider)

        // Declaring this for later so we can chain functions on powInstance.
        //var powInstance


        const publicAddress = this.state.web3.eth.coinbase.toLowerCase();
        console.log("--------public address----------")
        console.log(publicAddress);
        console.log('state: ', this.state)

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {

            pow.deployed().then((instance) => {
                this.powInstance = instance;
                this.setState({ account: accounts[0] });

                // Stores a given value, 5 by default.
               // return this.powInstance.set(5, { from: accounts[0] })
                // return this.powInstance.addDocument(this.state.digest, this.state.name, this.state.ipfsHash, { from: accounts[0] })
                //}).then((result) => {
                // Get the value from the contract to prove it worked.
                //    console.log("-------------result--------------")
                //    console.log(result);
                // console.log();
                //let digest = 0xac4e5792804146db61f6831d97392f6cc25bffbd70493f6e95296e8c76a6db69;
                //return this.powInstance.fetchDocument.call(this.state.digest, { from: accounts[0] })
            })
            
            // .then((result) => {
            //     // Update state with the result.
            //     console.log("-------------final result--------------");
            //     console.log(result);
            //     if (result[0] !== "") {
            //         return this.setState({ isUploaded: true, ipfsHash: result[2] });
            //     } else {
            //         console.log("result2 = empty")
            //         return this.setState({ isUploaded: false, ipfsHash: '' })
            //     }
            // }).catch((error) => {
            //     console.log("----------------error---------------")
            //     console.log(error)
            // })
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

        let { fileBuffer } = this.state;
        let $imagePreview = null;
        let $modal = null;
        let ipfsUrl = null
        if (this.state.ipfsHash) {
            ipfsUrl = 'https://ipfs.infura.io/ipfs/' + this.state.ipfsHash;
        }

        console.log('ipfsUrl: ' + ipfsUrl);

        if (fileBuffer) {
            console.log("Document has been selected")
            console.log(this.state.fileInput)
            $imagePreview = (
                <div>
                    <DocumentPreviewCard fileBuffer={ipfsUrl} />
                    <DocumentDetailsCard
                        fileInput={this.state.fileInput}
                        name={this.state.name}
                        email={this.state.email}
                        timestamp={this.state.dateInput}
                        digest={this.state.digest} />
                </div>
            );
        }

        if (this.state.isUploaded) {
            $modal = (
                <div>
                    <WarningModal
                        warning={this.state.warning}
                        toggleWarning={this.toggleWarning}
                        message="The document does not exist in blockchain"
                    />);
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
                            {$modal}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6" lg="4">
                            <Card className="text-dark bg-light">
                                <CardHeader>
                                    Card title
                                 </CardHeader>
                                <CardBody className="pb-0">
                                    <div className="text-value">9.823</div>
                                    <div>Members online</div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" sm="6" lg="4">
                            <Card className="text-dark bg-light">
                                <CardHeader>
                                    Card title
                                 </CardHeader>
                                <CardBody className="pb-0">
                                    <div className="text-value">9.823</div>
                                    <div>Members online</div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" sm="6" lg="4">
                            <Card className="text-dark bg-light">
                                <CardHeader>
                                    Card title
                                 </CardHeader>
                                <CardBody className="pb-0">
                                    <div className="text-value">9.823</div>
                                    <div>Members online</div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        )
    }
}

export default Notarize;