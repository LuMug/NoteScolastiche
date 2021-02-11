import React, { Component, ReactNode } from 'react'
import './loading-page.css';

class LoadingPage extends Component {

    constructor(props: {}) {
        super(props);
    }

    render(): ReactNode {
        return (
            <div className="lp-main">
                <div className="lp-loading-bar"></div>
            </div>
        );
    }
}

export default LoadingPage;