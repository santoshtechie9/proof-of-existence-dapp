import React, { Component } from 'react';
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
  Row,
} from 'reactstrap';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  render() {
    return (
      <div className="animated fadeIn flex-row align-items-center">
        <Card>
          <CardHeader>
            <strong>Basic Form</strong> Elements
              </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label>Static</Label>
                </Col>
                <Col xs="12" md="9">
                  <p className="form-control-static">Username</p>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Text Input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                  <FormText color="muted">This is a help text</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email-input">Email Input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="email" id="email-input" name="email-input" placeholder="Enter Email" autoComplete="email" />
                  <FormText className="help-block">Please enter your email</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="password-input">Password</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="password" id="password-input" name="password-input" placeholder="Password" autoComplete="new-password" />
                  <FormText className="help-block">Please enter a complex password</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date-input">Date Input <Badge>NEW</Badge></Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" id="date-input" name="date-input" placeholder="date" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="disabled-input">Disabled Input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="disabled-input" name="disabled-input" placeholder="Disabled" disabled />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="textarea-input">Textarea</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="textarea" name="textarea-input" id="textarea-input" rows="9"
                    placeholder="Content..." />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="file-input">File input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="file" id="file-input" name="file-input" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="file-multiple-input">Multiple File input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="file" id="file-multiple-input" name="file-multiple-input" multiple />
                </Col>
              </FormGroup>
              <FormGroup row hidden>
                <Col md="3">
                  <Label className="custom-file" htmlFor="custom-file-input">Custom file input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Label className="custom-file">
                    <Input className="custom-file" type="file" id="custom-file-input" name="file-input" />
                    <span className="custom-file-control"></span>
                  </Label>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <strong>Inline</strong> Form
              </CardHeader>
          <CardBody>
            <Form action="" method="post" inline>
              <FormGroup className="pr-1">
                <Label htmlFor="exampleInputName2" className="pr-1">Name</Label>
                <Input type="text" id="exampleInputName2" placeholder="Jane Doe" required />
              </FormGroup>
              <FormGroup className="pr-1">
                <Label htmlFor="exampleInputEmail2" className="pr-1">Email</Label>
                <Input type="email" id="exampleInputEmail2" placeholder="jane.doe@example.com" required />
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default Forms;
