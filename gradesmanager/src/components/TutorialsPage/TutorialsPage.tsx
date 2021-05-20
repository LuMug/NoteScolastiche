import * as tutorialsData from './../../data/tutorials.json';
import fs from 'fs';
import Page from '../Page/Page';
import React, { useEffect } from 'react';
import TutorialPanel from '../tutorial-panel/TutorialPanel';
import { IError, ITutorialPanelData } from '../../@types';
import { useState } from 'react';
import './TutorialsPage.css';

interface ITutorialsPageProps {

    uuid: number | null;
}

const TutorialsPage: React.FunctionComponent<ITutorialsPageProps> = (props) => {
    const [tutorials, setTutorials] = useState<ITutorialPanelData[]>((tutorialsData as any).default);

    return <Page
        user={null}
        displayPrompt={false}>
        <div className="tupa-main-content">
            {tutorials.map((t, i) => {
                return <div className="tupa-panel" key={i}>
                    <TutorialPanel data={t} />
                </div>
            })}
        </div>
    </Page>
}

export default TutorialsPage;