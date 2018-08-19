import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import forge from 'node-forge';
import BasicForm from '../../components/Forms/BasicForm/BasicForm';
import DocumentDetailsCard from '../../components/Cards/DocumentDetailsCard/DocumentDetailsCard';
import DocumentPreviewCard from '../../components/Cards/DocumentPreviewCard/DocumentPreviewCard';
import WarningModal from '../../components/Modals/WarningModal';
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
        this.setState({uploadedInIpfs: false})
        ipfs.files.add(this.state.fileBuffer, (error, result) => {
          
            if (error) {
                console.error(error);
                window.alert(error)
                return;
            }

            this.setState({ipfsHash: result[0].hash})
            console.log('digest: ', this.state.digest);
            console.log('name: :', this.state.name);
            console.log('account: ', this.state.account);
            console.log('ipfsHash: ', this.state.ipfsHash);
            console.log("submit button this:",this);
            this.state.powInstance.uploadDocument(this.state.digest, this.state.name, result[0].hash, { from: this.state.account }).then((result)=>{
                console.log("upload document result: " , result)
               return  this.state.powInstance.fetchDocument.call(this.state.digest, { from: this.state.account })
            }).then(result => {
                this.setState({digest:result[0],timestamp:result[1].valueOf(),ipfsHash:result[2]})
                console.log("fetch document: ", result);
            }).error((error)=>{
                console.log("error: ", error);
                window.alert(error);
            })
            //this.setState({ ipfsHash: result[0].hash });
        });

        console.log("file has been uploaded to IPFS")
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
        let readerPreview = new window.FileReader();

        console.log("Notarize: handle image change: file",file);
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
                this.setState({ fileInput: file.name, fileBuffer: Buffer(reader.result), digest: digest });
                console.log('buffer:', this.state.fileBuffer);
                var docHash = digest;
                console.log("docHash: " , docHash);
            }
            readerPreview.readAsDataURL(file);
            readerPreview.onloadend = () => {
                this.setState({imagePreviewData: readerPreview.result})
                console.log("Notarize: image change: state: " , this.state)
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
                this.setState({ powInstance:instance , account: accounts[0] });
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
                    {/* <DocumentPreviewCard fileBuffer={ipfsUrl} /> */}
                    <DocumentPreviewCard fileBuffer={this.state.imagePreviewData} />
                    <DocumentDetailsCard
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
                </Container>
            </div>
        )
    }
}

export default Notarize;