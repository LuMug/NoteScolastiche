import path from 'path';
import { ITutorialPanelData } from '../../@types';
import { useEffect, useState } from 'react';
import './tutorial-panel.css';

interface ITutorialPanelProps {

    data: ITutorialPanelData;
}

const TutorialPanel: React.FunctionComponent<ITutorialPanelProps> = (props) => {
    useEffect(() => {
        const importImg = async () => {
            // let data = await import('./../../public/img/gitlogo_dark.png');
        }
        importImg();
    }, []);

    return <div className="tpan-anim-wrapper">
        <div className="tpan-main-content">
            <div className="tpan-img-wrapper">
                {/* <img className="tpan-img" src={props.data.image} alt="tut image" /> */}
            </div>
            <div className="tpan-body">
                <p className="tpan-title">{props.data.title}</p>
                <div className="tpan-content">{props.data.content}</div>
            </div>
        </div>
    </div>
}

export default TutorialPanel;