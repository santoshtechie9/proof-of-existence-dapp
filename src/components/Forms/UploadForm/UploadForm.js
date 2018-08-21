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
  FormText,
  Input,
  Label,
} from 'reactstrap';

const UploadForm = (props) => {

    return (
      <div className="animated fadeIn flex-row align-items-center">
        <Card >
          <CardHeader>
            <strong>Upload</strong> Form
              </CardHeader>
          <CardBody>
            <Form id="document-uplaod-form" action="" method="post" encType="multipart/form-data" className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label>Type</Label>
                </Col>
                <Col xs="12" md="9">
                  <p className="form-control-static">Enter the detail in below section.</p>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="exampleInputName2" >Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="exampleInputName2" placeholder="John Doe" name="name" onChange={ (event) => props.handleChange(event)} required />
                  <FormText className="help-block">Please enter your name</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="exampleInputEmail2" >Email</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="email" id="exampleInputEmail2" placeholder="name@example.com" name="email" onChange={(event) => props.handleChange(event)} required />
                  <FormText className="help-block">Please enter your email</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="dateInput">Date Input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" id="dateInput" name="dateInput" placeholder="date" onChange={(event) => props.handleChange(event)} />
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
            <Button type="submit" size="sm" color="primary" onClick={props.handleSubmit}><i className="fa fa-dot-circle-o"></i> Upload</Button>&nbsp; &nbsp;
            <Button type="reset" size="sm" color="danger" onClick={props.handleReset}><i className="fa fa-ban"></i> Reset</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

export default UploadForm;
