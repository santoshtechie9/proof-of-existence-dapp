import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import DetailCard from '../../components/Cards/DetailCard/DetailCard';
import PreviewCard from '../../components/Cards/PreviewCard/PreviewCard';
import VerificationForm from '../../components/Forms/VerificationForm/VerificationForm';
import WarningModal from '../../components/Modals/WarningModal';
import getWeb3 from '../../utils/getWeb3';
import Proof from '../../../build/contracts/Proof.json';
import Relay from '../../../build/contracts/Relay.json';
import getContract from '../../utils/getContract';


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
        docHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
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

        getWeb3.then(results => {

            const publicAddress = results.web3.eth.coinbase.toLowerCase();
            const proofLogicInstance = getContract(Proof);
            const relayInstance = getContract(Relay);
            console.log(" Verify componentWillMount  this: ", this);

            this.setState({
                web3: results.web3,
                publicAddress: publicAddress,
                proofLogicInstance: proofLogicInstance,
                relayInstance: relayInstance
            })

        })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    handleReset = () => {
        console.log("Inside handleReset ")
        document.getElementById("document-verification-form").reset();
        this.setState({ name: '', email: '', dateInput: '', fileInput: '', imagePreviewUrl: '', digest: '', blockchainDigest: '', docHash: '' });
        console.log(this.state)

    }

    handleSubmit = (event) => {
        console.log("Clicked on Submit button ");
        console.log(this.state);
        this.instantiateContract();
    }

    handleImageChange = (event) => {

        event.preventDefault();
        console.log("inside handleImageChange funtion")

        let name = event.target.name;
        let value = event.target.value;
        if (name !== "fileInput" && value.length !== 0) {
            // convet the text fields in to hex string so that they can be handled as byte arrays in solidity contracts
            this.setState({ [name]: value });
            // let hexString = this.state.web3.fromAscii(value);
            // let stringHex = this.state.web3.toAscii(hexString);
            //  console.log(" ascii to hex: ", hexString);
            //  console.log(" hex to ascii: ", stringHex);
        } else {
            console.log("empty data nothing to set")
        }

        console.log(this.state)

        //let file = event.target.files[0];
        //let reader = new window.FileReader();

        // console.log(file);
        //console.log("FieldName=" + e.target.name);
        // console.log("FieldValue=" + e.target.value);

        // if (file) {
        //     reader.readAsArrayBuffer(file);
        //     // reader.readAsDataURL(file)
        //     reader.onloadend = () => {
        //         var md = forge.md.sha256.create();
        //         md.update(Buffer(reader.result));
        //         let digest = '0x' + md.digest().toHex();
        //         console.log("digest = " + digest);
        //         //console.log("reader result = " + reader.result);
        //         //Set the state variable here selected file name, imagePreviewURL and digest
        //         this.setState({ fileInput: file.name, imagePreviewUrl: Buffer(reader.result), digest: digest });
        //     }
        // } else {
        //     console.log('There is no image file selected')
        //     //when the image is unselected reset the state variables
        //     this.setState({ fileInput: '', imagePreviewUrl: null });
        // }
    }

    instantiateContract = () => {

        // Declaring this for later so we can chain functions on pow.
        // var powInstance

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {

            if (error) {
                console.error(error);
                window.alert(error)
                return;
            }

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
                console.log("docHash", this.state.docHash)
                return this.proofOfLogicInst.fetchDocument.call(this.state.docHash, { from: this.state.publicAddress });
            }).then((result) => {
                console.log("proofLogic download result: ", result);
                if (result[0] !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                    console.log("result state set")
                    var utcSeconds = result[2].valueOf();
                    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    d.setUTCSeconds(utcSeconds);
                    return this.setState({
                        contractResponse: {
                            hash: result[0],
                            name: this.state.web3.toAscii(result[1]),
                            timestamp: d.toLocaleString(),
                            ipfsHash: this.state.web3.toAscii(result[3]),
                            docTags: this.state.web3.toAscii(result[4]),
                            isPresent: true
                        },
                        warning: false
                    });
                } else {
                    console.log("result2 = empty")
                    return this.setState({
                        contractResponse: {
                            hash: result[0],
                            name: result[1],
                            timestamp: result[2],
                            ipfsHash: result[3],
                            isPresent: false
                        }, warning: true
                    })
                }
            }).catch((error) => {
                console.log("----------------error---------------")
                console.log(error)
                window.alert("Unable to fetch greet. Deploy Smart Contracts and Activate Metmask")
            })

            // pow.deployed().then((instance) => {
            //     powInstance = instance;
            //     console.log(powInstance);
            //     return powInstance.fetchDocument.call(this.state.digest, { from: accounts[0] })
            // }).then((result) => {
            //     // Get the value from the contract to prove it worked.
            //     console.log("final result");
            //     console.log("Verify: Instatiate Contract: result", result);
            //     if (result[0] !==  "0x0000000000000000000000000000000000000000000000000000000000000000") {
            //         console.log("result state set")
            //         return this.setState({ contractResponse: { hash: result[0], timestamp: result[1].valueOf(), ipfsHash: result[2], name: "userName",email:"abc@abc.com", isPresent: true }, warning: true });
            //     } else {
            //         console.log("result2 = empty")
            //         return this.setState({ contractResponse: { hash: result[0], timestamp: result[1], ipfsHash: result[2], name: "",email:"", isPresent: false }, warning: true })
            //     }
            // }).catch(error => {
            //     console.log("----------error---------")
            //     console.log(error)
            //     window.alert(error)
            // })


        })
    }

    render() {

        let imagePreviewUrl = this.state.docHash;
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
                    <PreviewCard fileBuffer={ipfsUrl} />
                    <DetailCard
                        fileInput={this.state.contractResponse.fileInput}
                        name={this.state.contractResponse.name}
                        docTags={this.state.contractResponse.docTags}
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