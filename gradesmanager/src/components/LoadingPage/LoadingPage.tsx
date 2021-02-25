import React, { Component, ReactNode } from 'react';
import './loading-page.css';

interface ILoadingPageProps {

    unavailable?: boolean;
}

class LoadingPage extends Component<ILoadingPageProps> {

    constructor(props: {}) {
        super(props);
    }

    render(): ReactNode {
        let cName = (this.props.unavailable)
            ? 'lp-msg-container'
            : 'lp-hidden';
        return (
            <div className="lp-main">
                <div className="lp-loading-bar">
                    <div className={cName}>
                        <p className="lp-msg">Oh no!</p>
                        <p className="lp-msg-hint">Siamo offline, prova a ricaricare la pagina tra un po'</p>
                    </div>

                </div>
            </div>
        );
    }
}

export default LoadingPage;