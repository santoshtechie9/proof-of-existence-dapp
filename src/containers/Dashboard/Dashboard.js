import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Label } from 'reactstrap';
import getWeb3 from '../../utils/getWeb3';
import ProofOfExistanceContract from '../../../build/contracts/ProofOfExistance.json';

class Dashboard extends Component {

    state = {
        docHashList: [],
        items: []
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                let personalAddress = results.web3.eth.coinbase.toLowerCase();
                console.log("Dashboard: personalAddress: ", personalAddress);
                this.setState({
                    web3: results.web3,
                    address: personalAddress
                })
                // Instantiate contract once web3 provided.
                this.instantiateContract()

            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    instantiateContract = () => {
        const contract = require('truffle-contract')
        const pow = contract(ProofOfExistanceContract)
        pow.setProvider(this.state.web3.currentProvider)

        // Declaring this for later so we can chain functions on powInstance.
        //var powInstance
        const publicAddress = this.state.web3.eth.coinbase.toLowerCase();
        console.log("--------public address----------")
        console.log("publicAddress", publicAddress);
        console.log('Dashboard : state: ', this.state)

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            pow.deployed().then((instance) => {
                console.log("inside deployed method");
                this.powInstance = instance;
                this.setState({ account: accounts[0] });
                return instance.fetchAllDocuments.call(accounts[0], { from: accounts[0] })
            }).then((results) => {
                // Update state with the result.
                console.log("-------------final result--------------");
                console.log(results);
                this.setState({ docHashList: results })
                results.map((x, index) => {
                    console.log(x)
                    this.powInstance.fetchDocument.call(x, { from: accounts[0] })
                        .then((result) => {
                            let item = {
                                docHash: result[0],
                                docTimestamp: result[1],
                                ipfsHash: result[2]
                            }
                            let itemsList = this.state.items;
                            itemsList.push(item);
                            this.setState({ items: itemsList })
                        })
                })
                console.log("state = ", this.state)
            }).catch((error) => {
                console.log("----------------error---------------")
                console.log(error)
                this.setState({ items: null })
                //window.alert("Unable to fetch documents. Deploy Smart Contracts and Activate Metmask")
            })
        })
    }

    render() {
        const stylr = { maxHeight: "440px", overflowY: "scroll" }
        let items = [
            {
                userName: "user1",
                docHash: "0x8194327041372418237410324871320847132",
                docTimestamp: '2018-08-18 20:30:23',
                ipfsHash: 'fdaskljfpiowejfadslkjavdlksjafopiweurqqpweorijafsdfkljasd;fiqoweurpqewoi',
            },
            {
                userName: "user1",
                docHash: "0x8194327041372418237410324871320847132",
                docTimestamp: '2018-08-18 20:30:23',
                ipfsHash: 'fdaskljfpiowejfadslkjavdlksjafopiweurqqpweorijafsdfkljasd;fiqoweurpqewoi',
            }, {
                userName: "user1",
                docHash: "0x8194327041372418237410324871320847132",
                docTimestamp: '2018-08-18 20:30:23',
                ipfsHash: 'fdaskljfpiowejfadslkjavdlksjafopiweurqqpweorijafsdfkljasd;fiqoweurpqewoi',
            }, {
                userName: "user1",
                docHash: "0x8194327041372418237410324871320847132",
                docTimestamp: '2018-08-18 20:30:23',
                ipfsHash: 'fdaskljfpiowejfadslkjavdlksjafopiweurqqpweorijafsdfkljasd;fiqoweurpqewoi',
            }, {
                userName: "user1",
                docHash: "0x8194327041372418237410324871320847132",
                docTimestamp: '2018-08-18 20:30:23',
                ipfsHash: 'fdaskljfpiowejfadslkjavdlksjafopiweurqqpweorijafsdfkljasd;fiqoweurpqewoi',
            }, {
                userName: "user1",
                docHash: "0x8194327041372418237410324871320847132",
                docTimestamp: '2018-08-18 20:30:23',
                ipfsHash: 'fdaskljfpiowejfadslkjavdlksjafopiweurqqpweorijafsdfkljasd;fiqoweurpqewoi',
            },
        ];

        items = this.state.items;
        let $dicplayCards = null;

        if (items !== null && items.length !== 0) {
            $dicplayCards = items.map((item) => {
                console.log("item.docHash", item.docHash)
                return (
                    <Row>
                        <Col xs="12" sm="12" lg="12">
                            <Card className="text-dark bg-light">
                                <CardBody className="pb-0">
                                    {/* <FormGroup row>
                                        <Col md="3">
                                            <Label><strong>docHash:</strong> </Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <p className="form-control-static">{item.docHash}</p>
                                        </Col>
                                    </FormGroup> */}
                                    <Col xs="12" md="12">
                                        <div class="tag token"><strong>docHash:</strong> {item.docHash}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div class="tag token"><strong>ipfsHash:</strong> {item.ipfsHash}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div class="tag token"><strong>docTimestamp:</strong> {item.docTimestamp}</div>
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            });

        } else {
            $dicplayCards = () => {
                console.log("items array is empty")
                return (
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
                                        <div id="activity_stream" style={stylr}>
                                            <div className="mb-4 col offset-lg-1 col-lg-10">
                                                {$dicplayCards}
                                            </div>
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