import React from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

const  infoModal = (props) => {

console.log("inside infoModal");

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Modal isOpen={props.info} toggle={props.toggleInfo}
              className={'modal-info ' + props.className}>
              <ModalHeader toggle={props.toggleInfo}>Modal title</ModalHeader>
              <ModalBody>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={ (e) => props.toggleInfo(e)}>Ok</Button>{' '}
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </div>
    );
  }

export default infoModal;
