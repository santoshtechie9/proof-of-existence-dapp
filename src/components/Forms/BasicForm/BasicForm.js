import React from 'react';
import {
  Badge,
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

const BasicForm = (props) => {

    return (
      <div className="animated fadeIn flex-row align-items-center">
        <Card >
          <CardHeader>
            <strong>Notarize</strong> Form
              </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
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
                  <Label htmlFor="dateInput">Date Input <Badge>NEW</Badge></Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" id="dateInput" name="dateInput" placeholder="date" onChange={(event) => props.handleChange(event)} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="textAreaInput">Textarea</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="textarea" name="textAreaInput" id="textAreaInput" rows="8"
                    placeholder="Enter text here" onChange={(event) => props.handleChange(event)} />
                  <FormText color="muted">This is a help text</FormText>
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
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="file-multiple-input">Multiple File input<Badge>Comming Soon</Badge></Label>
                </Col>
                <Col xs="12" md="9">
                  {/* <Input type="file" id="file-multiple-input" name="file-multiple-input" multiple /> */}
                </Col>
              </FormGroup>
              <FormGroup row hidden>
                <Col md="3">
                  <Label className="custom-file" htmlFor="custom-fileInput">Custom file input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Label className="custom-file">
                    <Input className="custom-file" type="file" id="custom-fileInput" name="fileInput" />
                    <span className="custom-file-control"></span>
                  </Label>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <Button type="submit" size="sm" color="primary" onClick={props.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

export default BasicForm;
