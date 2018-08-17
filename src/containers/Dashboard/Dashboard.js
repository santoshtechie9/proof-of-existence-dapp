import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Table, Progress } from 'reactstrap';
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
        /*
         * SMART CONTRACT EXAMPLE
         *
         * Normally these functions would be called in the context of a
         * state management library, but for convenience I've placed them here.
         */

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
                //let digest = 0xac4e5792804146db61f6831d97392f6cc25bffbd70493f6e95296e8c76a6db69;
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
            })
        })
    }



    render() {

        let items = [
            {
                userName: "santu",
                docHash: "image1",
                docTimestamp: 'You are Logged in as :',
                ipfsHash: 'Welcome to Proof Of Existence Dapp',
            },
            {
                userName: "santu",
                docHash: "image2",
                docTimestamp: 'You are Logged in as :',
                ipfsHash: 'Welcome to Proof Of Existence Dapp',
            }, {
                userName: "santu",
                docHash: "image3",
                docTimestamp: 'You are Logged in as :',
                ipfsHash: 'Welcome to Proof Of Existence Dapp',
            }, {
                userName: "santu",
                docHash: "image4",
                docTimestamp: 'You are Logged in as :',
                ipfsHash: 'Welcome to Proof Of Existence Dapp',
            },
        ];

        items = this.state.items;
        let slides2 = null;

        if (items.length !== 0) {
            slides2 = items.map((item) => {

                console.log("item.docHash", item.docHash)
                return (

                    <Row>
                    <Col xs="12" sm="12" lg="12">
                        <Card className="text-dark bg-light">
                            <CardHeader>
                                Card Title
                             </CardHeader>
                            <CardBody className="pb-0">
                                <div ><strong>docHash:</strong> {item.docHash}</div>
                                <br/>
                                <div ><strong>ipfsHash: </strong>{item.ipfsHash}</div>
                                <br/>
                                <div><strong>docTimestamp: </strong>item.docTimestamp</div>
                            </CardBody>
                        </Card>
                    </Col>
                    </Row>
                 )
            });

        } else {
            slides2 = () => {
                return (
                    <tr>
                        <td>
                            <strong>You did not upload any documents yet</strong>
                        </td>
                    </tr>
                );
            }
        }
        return (
            <div>
                <Container fluid>
                    {/* <Row>
                        <Col xs="12" md="6" xl="6">
                            <p>Welcom to Proof Of Existance App</p>
                        </Col >
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
                    </Row> */}
                    <br />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    User Documents List
              </CardHeader>
                                <CardBody>
                                    {slides2}
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