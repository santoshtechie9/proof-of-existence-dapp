import React from 'react';
import {Card,CardBody,Row,Col,Label} from 'reactstrap';

const artifactCard = (props) => {

    return (
        <div className="animated fadeIn flex-row align-items-center">
            <div className="animated fadeIn">
                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">Owner</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.name}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">E-mail</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.email}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">Timestamp</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.timestamp}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">Doc Hash</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.docHash}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">ipfs Hash</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.ipfsHash}</Label>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default artifactCard;
