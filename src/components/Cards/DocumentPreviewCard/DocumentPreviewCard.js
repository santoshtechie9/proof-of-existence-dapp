import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';

const documentPreviewCard = (props) => {

    const style = {
        //backgroundColor: 'rgba(255,0,0,0.1)',
        backgroundColor: 'green',
        padding: '8px',
        height: '350px',
    };

    return (
        <div className="animated fadeIn flex-row align-items-center">
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i><strong>Selected Document(s)</strong>
                    </CardHeader>
                    <CardBody>
                        <div>
                            <img style={style} className="mh-50 card-img" src={`${props.fileBuffer}`} alt="Default Card" />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default documentPreviewCard;
