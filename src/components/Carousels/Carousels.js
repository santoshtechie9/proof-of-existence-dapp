import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Col, Row } from 'reactstrap';

import image1 from '../../assets/image-1.jpg';
import image2 from '../../assets/image-2.jpg';
import image3 from '../../assets/image-3.jpg';

const items = [
  {
    src: image3,
    altText: 'Proof Of Ownership ',
    caption: 'Verification',
  },
  {
    src: image2,
    altText: 'Market Place',
    caption: 'e-commerce',
  },
  {
    src: image1,
    altText: 'Monopoly',
    caption: 'Game',
  },
];

class Carousels extends Component {

  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;

    const slides2 = items.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
          <img className="d-block w-100" src={item.src} alt={item.altText} />
          <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
        </CarouselItem>
      );
    });

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="6" xl="12">
            <Card>
            <CardHeader>
                <i className="fa fa-align-justify"></i><strong>Selected Document(s)</strong>
              </CardHeader>
              <CardBody>
                <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
                  <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                  {slides2}
                  <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                  <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                </Carousel>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Carousels;