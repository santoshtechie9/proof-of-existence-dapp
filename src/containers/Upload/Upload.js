import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import forge from 'node-forge';
import UploadForm from '../../components/Forms/UploadForm/UploadForm';
import DetailCard from '../../components/Cards/DetailCard/DetailCard';
import PreviewCard from '../../components/Cards/PreviewCard/PreviewCard';
import WarningModal from '../../components/Modals/WarningModal';
import ProofOfExistenceContract from '../../../build/contracts/ProofOfExistance.json';
import ProofLogic from '../../../build/contracts/ProofLogic.json';
import Relay from '../../../build/contracts/Relay.json';
import getWeb3 from '../../utils/getWeb3';
import getContract from '../../utils/getContract';
import ipfs from '../../utils/ipfs';

class Upload extends Component {

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
        console.log("componentWillMount Upload");



        getWeb3.then(results => {
            //add comments here
            const publicAddress = results.web3.eth.coinbase.toLowerCase();
            const proofOfExistenceInstance = getContract(ProofOfExistenceContract);
            const proofLogicInstance = getContract(ProofLogic);
            const relayInstance = getContract(Relay);
            console.log(" Upload componentWillMount  this: ", this);

            this.setState({
                web3: results.web3,
                loading: true,
                publicAddress: publicAddress,
                proofOfExistenceInstance: proofOfExistenceInstance,
                proofLogicInstance: proofLogicInstance,
                relayInstance: relayInstance
            })

        }).catch(() => {
            console.log('Error finding web3.')
        });
    }

    toggleWarning = () => {
        this.setState({
            warning: !this.state.warning,
        });
    }

    handleReset = () => {
        console.log("Inside handleReset ")
        document.getElementById("document-uplaod-form").reset();
        this.setState({ name: '', email: '', dateInput: '', fileInput: '', imagePreviewUrl: '', digest: '', blockchainDigest: '', fileBuffer:'' });
        console.log(this.state)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // const powInstance = this.powInstance;
        console.log("Clicked on Submit button ");
        console.log(this.state);
        this.setState({ uploadedInIpfs: false })
        // ipfs.files.add(this.state.fileBuffer, (error, result) => {

        //     if (error) {
        //         console.error(error);
        //         window.alert(error)
        //         return;
        //     }

           // console.log("file has been uploaded to ipfs =", result)
        // this.setState({ ipfsHash: result[0].hash, uploadedInIpfs: false })
             this.setState({ ipfsHash: this.state.digest, uploadedInIpfs: false })
            console.log('digest :', this.state.digest);
            console.log('name :', this.state.name);
            console.log('account :', this.state.account);
            console.log('ipfsHash :', this.state.ipfsHash);
            console.log("submit button this :", this);

            this.state.web3.eth.getAccounts((error, accounts) => {

                if (error) {
                    console.error(error);
                    window.alert(error)
                    return;
                }
                
                // this.state.proofOfExistenceInstance.deployed().then((instance) => {
                //     //return instance.uploadDocument(this.state.digest, this.state.name, result[0].hash, { from: this.state.publicAddress });
                //     return instance.uploadDocument(this.state.digest, this.state.name, this.state.digest, { from: this.state.publicAddress });
                // }).then((uploadResult)=>{
                //     console.log("uploadResult =",uploadResult);
                //     window.alert("document has been uploaded");
                // }).catch((error => {
                //     console.error(error);
                //     window.alert(error)
                // }))


                //const proofOfLogicInst;

                this.state.relayInstance.deployed().then((instance) => {
                    return instance.getCurrentVersion.call({ from: this.state.publicAddress });
                }).then((currentContractAddress) => {
                    console.log("relayInstance  current address : ", currentContractAddress)
                    return currentContractAddress;
                }).then((proofLogicAddress) => {
                    this.proofOfLogicInst = this.state.proofLogicInstance.at(proofLogicAddress);
                    return this.proofOfLogicInst;
                }).then((proofLogicInstance) => {
                    console.log("Inside proofLogic1")
                    //return proofLogicInstance.upDocument(this.state.digest, this.state.name, result[0].hash,{ from: this.state.publicAddress });
                    return proofLogicInstance.uploadDocument(this.state.digest, this.state.name, this.state.digest,{ from: this.state.publicAddress });
                }).then((result) => {
                    console.log("proofLogic upload result: ", result);
                    return this.proofOfLogicInst.fetchDocument.call(this.state.digest,{from:this.state.publicAddress});
                }).then((downloadDocumentResult)=>{
                    console.log("proofLogic download result: ", downloadDocumentResult);
                }).catch((error) => {
                    console.log("----------------error---------------")
                    console.log(error)
                    window.alert("Unable to fetch greet. Deploy Smart Contracts and Activate Metmask")
                })


            });
        //});

    }


    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
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
        let readerPreview = new window.FileReader();

        console.log("Upload: handle image change: file", file);
        console.log("name=" + e.target.name);
        console.log("value=" + e.target.value);

        if (file) {
            // Create file buffer array to upload in IPFS
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                var md = forge.md.sha256.create();
                md.update(Buffer(reader.result));
                let digest = '0x' + md.digest().toHex();
                console.log("digest: ", digest);
                this.setState({ fileInput: file.name, fileBuffer: Buffer(reader.result), digest: digest });
                console.log('buffer:', this.state.fileBuffer);
                var docHash = digest;
                console.log("docHash: ", docHash);
            }
            // Create file data stream to display in the preview component
            readerPreview.readAsDataURL(file);
            readerPreview.onloadend = () => {
                this.setState({ imagePreviewData: readerPreview.result })
                console.log("Upload: image change: state: ", this.state)
            }
        } else {
            console.log('There is no image file selected')
            this.setState({ fileInput: '', fileBuffer: '' });
        }

        console.log(this.state.fileBuffer);

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
                    {/* <PreviewCard fileBuffer={ipfsUrl} /> */}
                    <PreviewCard fileBuffer={this.state.imagePreviewData} />
                    <DetailCard
                        fileInput={this.state.fileInput}
                        name={this.state.name}
                        email={this.state.email}
                        timestamp={this.state.dateInput}
                        docHash={this.state.digest}
                        ipfsHash={this.state.ipfsHash} />
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
                            <UploadForm
                                name={prefill.name}
                                handleSubmit={this.handleSubmit}
                                handleReset={this.handleReset}
                                handleChange={this.handleChange}
                                handleImageChange={this.handleImageChange} />
                        </Col >
                        <Col xs="12" md="6" xl="6">
                            {$imagePreview}
                            {$modal}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Upload;