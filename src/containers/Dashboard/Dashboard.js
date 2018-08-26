import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import getWeb3 from '../../utils/getWeb3';
import getContract from '../../utils/getContract';
import Proof from '../../../build/contracts/Proof.json';
import Register from '../../../build/contracts/Register.json';

class Dashboard extends Component {

    state = {
        items: []
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3.then(results => {
            console.log("Initializing the contract");
            //Get the current active account
            let publicAddress = results.web3.eth.coinbase.toLowerCase();
            // Initiating contracts during component mount
            const proofLogicInstance = getContract(Proof);
            const registerInstance = getContract(Register);
            //set the instance in state object to access then across contract
            this.setState({
                web3: results.web3,
                publicAddress: publicAddress,
                proofLogicInstance: proofLogicInstance,
                registerInstance: registerInstance,
            })
        }).then(() => {
            this.fetchUserProfileDataFromBlockchain();
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    fetchUserProfileDataFromBlockchain = () => {
        // Declaring this for later so we can chain functions on powInstance.
        console.log('Dashboard : state: ', this.state)

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            this.state.registerInstance.deployed().then((instance) => {
                return instance.getCurrentVersion.call({ from: this.state.publicAddress });
            }).then((currentContractAddress) => {
                console.log("register contract Instance  current address : ", currentContractAddress)
                return currentContractAddress;
            }).then((proofLogicAddress) => {
                return this.state.proofLogicInstance.at(proofLogicAddress)
            }).then((instance) => {
                console.log("Inside proofLogic contract instance")
                this.proofLogicInst = instance;
                return this.proofLogicInst.fetchAllDocuments.call({ from: this.state.publicAddress });
            }).then((results) => {
                console.log("proofLogic fetch all documents result: ", results);
                // Update state with the result.
                this.setState({ docHashList: results })
                // iterate throught he list and fetch individual document details
                results.map((x, index) => {
                    this.proofLogicInst.fetchDocument.call(x, { from: accounts[0] })
                        .then((result) => {
                            // Convert timestamp from UTC to local
                            var utcSeconds = result[2].valueOf();
                            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            d.setUTCSeconds(utcSeconds);
                            let item = {
                                docHash: result[0],
                                userName: this.state.web3.toAscii(result[1]),
                                docTimestamp: d.toLocaleString(),
                                ipfsHash: this.state.web3.toAscii(result[3]),
                                docTags: this.state.web3.toAscii(result[4])
                            }
                            let itemsList = this.state.items;
                            itemsList.push(item);
                            this.setState({ items: itemsList })
                            return '';
                        })
                    return '';
                })
            }).catch((error) => {
                console.log("Error Message:", error)
                window.alert(error)
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
                        <Col xs="12" sm="12" lg="12" className="align-middle">
                            <Card className="text-dark bg-light">
                                <CardBody className="pb-0">
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>User Name &emsp;&emsp;: </strong>{item.userName}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>Doc Timestamp: </strong> {item.docTimestamp}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>Doc Hash &emsp;&emsp;&ensp;&nbsp;: </strong> {item.docHash}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>Doc Tags &emsp;&emsp;&ensp;&ensp;: </strong> {item.docTags}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>ipfs Hash &emsp;&emsp;&ensp;&ensp;: </strong> {item.ipfsHash}</div>
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            });

        } else {
            $displayCards =
                (
                    <Row>
                        <Col xs="12" sm="12" lg="12">
                            <Card className="text-dark bg-light">
                                <CardBody className="pb-0">
                                    <div className="tag">
                                        You have not uploaded any documents yet.
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                );
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
                                            {$displayCards}
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