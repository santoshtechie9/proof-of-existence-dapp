import React from 'react';
import {
  Button,
  Card,
  CardBody,
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
        <br />
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
                <Label htmlFor="exampleInputName2" >First Name</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="exampleInputName2" placeholder="John" name="firstname" onChange={(event) => props.handleChange(event)} required />
                <FormText className="help-block">Please enter your name</FormText>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="exampleInputName3" >Last Name</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="exampleInputName3" placeholder="Doe" name="lastname" onChange={(event) => props.handleChange(event)} required />
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
                <Label htmlFor="dateInput">Date </Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="date" id="dateInput" name="dateInput" placeholder="date" onChange={(event) => props.handleChange(event)} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="fileInput">Input</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="file" id="fileInput" name="fileInput" onChange={(e) => props.handleImageChange(e)} />
              </Col>
            </FormGroup>
          </Form>
            <Button type="reset" size="sm" color="warning"><i className="fa fa-ban"></i> Reset</Button>&nbsp; &nbsp;
          <Button type="submit" size="sm" color="info" onClick={props.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default BasicForm;
