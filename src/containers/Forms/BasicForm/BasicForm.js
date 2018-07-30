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
} from 'reactstrap';

class BasicForm extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      name:'',
      email:'',
      dateInput:'',
      textAreaInput:'',
      fileInput:''
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  handleSubmit = (event) => {
    console.log("Clicked on Submit button ");
    console.log(this.state);
  } 

handleChange = (event) => {
  let name = event.target.name;
  let value = event.target.value
  console.log("name="+name);
  console.log("value="+value);
  this.setState({[name]:value});
}

  render() {

    const prefill = {
      imageFileName:"ProfileImage.jpg",
      name:"John Doe",
      email:"name@example.com",
      dateFormat:"dd/yy/mm",
      textArea:"Enter text here"
  }

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
                  <Input type="text" id="exampleInputName2" placeholder={prefill.name} name="name" onChange={(event) => this.handleChange(event)} required />
                  <FormText className="help-block">Please enter your name</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="exampleInputEmail2" >Email</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="email" id="exampleInputEmail2" placeholder={prefill.email} name="email" onChange={(event) => this.handleChange(event)} required />
                  <FormText className="help-block">Please enter your email</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="dateInput">Date Input <Badge>NEW</Badge></Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" id="dateInput" name="dateInput" placeholder="date" onChange={(event) => this.handleChange(event)}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="textAreaInput">Textarea</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="textarea" name="textAreaInput" id="textAreaInput" rows="7"
                    placeholder={prefill.textArea} onChange={(event) => this.handleChange(event)} />
                  <FormText color="muted">This is a help text</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="fileInput">File input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="file" id="fileInput" name="fileInput" onChange={(event) => this.handleChange(event)} />
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
            <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default BasicForm;
