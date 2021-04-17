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
            ? 'loap-msg-container'
            : 'loap-hidden';
        return (
            <div className="loap-main">
                <div className="loap-loading-bar">
                    <div className={cName}>
                        <p className="loap-msg">Oh no!</p>
                        <p className="loap-msg-hint">Siamo offline, prova a ricaricare la pagina tra un po'</p>
                    </div>

                </div>
            </div>
        );
    }
}

export default LoadingPage;