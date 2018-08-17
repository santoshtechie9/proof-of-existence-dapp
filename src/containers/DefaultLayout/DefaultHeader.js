import React, { Component } from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppHeaderDropdown, AppSidebarToggler } from '@coreui/react';

import logo from '../../assets/img/brand/Dapp-3.svg';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
 
  render() {


    const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="notarize">Notarize</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="verify">Verify Document</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              {/* <img src={logo} className="img-avatar" alt="santoshtechie9@gmail.com" /> */}
            {<p > {this.props.address}</p>}
            
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
