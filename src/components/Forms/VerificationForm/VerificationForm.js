import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';

const VerificationForm = (props) => {

    return (
      <div className="animated fadeIn flex-row align-items-center">
        <Card >
          <CardHeader>
            <strong>Document Verification</strong> Form
              </CardHeader>
          <CardBody>
            <Form id="document-verification-form" action="" method="post" encType="multipart/form-data" className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label>Type</Label>
                </Col>
                <Col xs="12" md="9">
                  <p className="form-control-static">Upload the document.</p>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="fileInput">File input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="file" id="fileInput" name="fileInput" onChange={(e)=>props.handleImageChange(e)} />
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <Button type="submit" size="sm" color="primary" onClick={props.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp; &nbsp;
            <Button type="reset" size="sm" color="danger" onClick={props.handleReset}><i className="fa fa-ban"></i> Reset</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

export default VerificationForm;
