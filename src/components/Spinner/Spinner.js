import React from 'react';
import './spinner.css';

const spinner = (props) => {

    return (

        <div>
            <center>
                {/* <p>loading...</p> */}
                <span className="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                {/* <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="Loading..." style={style}/> */}
            </center>
        </div>
    );

}

export default spinner;