import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import getWeb3 from '../../utils/getWeb3';
import getContract from '../../utils/getContract';
import ProofOfExistanceContract from '../../../build/contracts/ProofOfExistance.json';
import Proof from '../../../build/contracts/Proof.json';
import Relay from '../../../build/contracts/Relay.json';

class Dashboard extends Component {

    state = {
        items: []
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3.then(results => {
            let publicAddress = results.web3.eth.coinbase.toLowerCase();
            console.log("Dashboard: publicAddress: ", publicAddress);
            console.log("Initializing the contract");
            const ProofOfExistanceInstance = getContract(ProofOfExistanceContract);
            const proofLogicInstance = getContract(Proof);
            const relayInstance = getContract(Relay);

            this.setState({
                web3: results.web3,
                publicAddress: publicAddress,
                ProofOfExistanceInstance: ProofOfExistanceInstance,
                proofLogicInstance: proofLogicInstance,
                relayInstance: relayInstance,
            })

        }).then(() => {
            this.instantiateContract();
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    instantiateContract = () => {
        // Declaring this for later so we can chain functions on powInstance.
        //var powInstance
        const publicAddress = this.state.web3.eth.coinbase.toLowerCase();
        console.log("--------public publicAddress----------")
        console.log("publicAddress", publicAddress);
        console.log('Dashboard : state: ', this.state)

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {

            // this.state.ProofOfExistanceInstance.deployed().then((instance) => {
            //     console.log("inside deployed method");
            //     this.powInstance = instance;
            //     console.log("instance", instance);
            //     this.setState({ account: accounts[0] });
            //     return instance.fetchAllDocuments.call(accounts[0], { from: accounts[0] })
            // }).then((results) => {
            //     // Update state with the result.
            //     console.log("-------------final result--------------");
            //     console.log(results);
            //     this.setState({ docHashList: results })
            //     results.map((x, index) => {
            //         this.powInstance.fetchDocument.call(x, { from: accounts[0] })
            //             .then((result) => {
            //                 let item = {
            //                     docHash: result[0],
            //                     docTimestamp: result[1],
            //                     ipfsHash: result[2],
            //                     userName: "userName"
            //                 }
            //                 let itemsList = this.state.items;
            //                 itemsList.push(item);
            //                 this.setState({ items: itemsList })
            //                 return '';
            //             })
            //         return '';
            //     })
            //     console.log("state = ", this.state)
            // }).catch((error) => {
            //     console.log("----------------error---------------")
            //     console.log(error)
            //     this.setState({ items: null })
            //     window.alert("Unable to fetch documents. Deploy Smart Contracts and Activate Metmask")
            // })

            //const proofLogicInst;

            this.state.relayInstance.deployed().then((instance) => {
                return instance.getCurrentVersion.call({ from: this.state.publicAddress });
            }).then((currentContractAddress) => {
                console.log("relayInstance  current address : ", currentContractAddress)
                return currentContractAddress;
            }).then((proofLogicAddress) => {
                return this.state.proofLogicInstance.at(proofLogicAddress)
            }).then((instance) => {
                console.log("Inside proofLogic1")
                this.proofLogicInst = instance;
                return this.proofLogicInst.fetchAllDocuments.call({ from: this.state.publicAddress });
            }).then((results) => {
                console.log("proofLogic result: ", results);
                // Update state with the result.
                console.log("-------------final result--------------");
                console.log(results);
                this.setState({ docHashList: results })
                results.map((x, index) => {
                    this.proofLogicInst.fetchDocument.call(x, { from: accounts[0] })
                        .then((result) => {
                            let item = {
                                docHash: result[0],
                                userName: result[1],
                                docTimestamp: result[2],
                                ipfsHash: result[3],
                            }
                            let itemsList = this.state.items;
                            itemsList.push(item);
                            this.setState({ items: itemsList })
                            return '';
                        })
                    return '';
                })
                console.log("state = ", this.state)

            }).catch((error) => {
                console.log("----------------error---------------")
                console.log(error)
                window.alert("Unable to fetch documents. Deploy Smart Contracts and Activate Metmask")
            })
        })

    }

    render() {
        const style = { maxHeight: "440px", overflowY: "scroll" }
        let items = this.state.items;
        let $displayCards = '';

        if (items !== null && items.length !== 0) {
            $displayCards = items.map((item, index) => {
                return (
                    <Row key={index}>
                        <Col xs="12" sm="12" lg="12">
                            <Card className="text-dark bg-light">
                                <CardBody className="pb-0">
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>User Name:</strong> {item.userName}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>Doc Timestamp:</strong> {"docTimestamp"}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>Doc Hash:</strong> {item.docHash}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>ipfs Hash:</strong> {item.ipfsHash}</div>
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            });

        } else {
            $displayCards = () => {
                return (
                    <Row>
                        <Col xs="12" sm="12" lg="12">
                            <Card className="text-dark bg-light">
                                <CardBody className="pb-0">
                                    <div className="tag">
                                        {/* You have not uploaded any documents yet. */}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                );
            }
        }
        return (
            <div>
                <Container fluid>
                    <br />
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <div className="container-fluid p-5 activity">
                                        <div className="col text-center mb-2">
                                            <h2 className="mb-4">Recent  Activity on Proof Of Existance Dapp</h2>
                                        </div>
                                        <div id="activity_stream" style={style}>
                                            {/* <div className="mb-4 col offset-lg-1 col-lg-10"> */}
                                            {$displayCards}
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    };
}

export default Dashboard;