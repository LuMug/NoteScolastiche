import FetchHelper from '../../helpers/FetchHelper';
import { useEffect, useState } from 'react';
import './welcome-component.css';

type Gender = 'male' | 'female' | null;

type GenderApiRes = {
    name: string;
    gender: Gender;
    probability: number;
    count: number;
    country_id: string;
}

interface IWelcomeComponentProps {
    name: string;
}

const WelcomeComponent: React.FunctionComponent<IWelcomeComponentProps> = (props) => {
    // const [gender, setGender] = useState<Gender>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            let res;
            try {
                //res = await FetchHelper.fetchGlobal(`https://api.genderize.io/?name=${props.name}&country_id=CH`);
                // if (res) {
                //     setGender(res.gender);
                // } else {
                //     setGender(null);
                // }
            } catch {
                // setGender(null);
            }
            setLoading(false);
        }
        //fetch();
        setLoading(false);
    }, []);

    let date = new Date();
    let isNight = date.getHours() > 17;

    // let text = (!gender)
    //     ? isNight ? 'Buonasera, ' : 'Buongiorno, '
    //     : gender === 'male'
    //         ? 'Benvenuto, '
    //         : 'Benvenuta';

    let text = isNight ? 'Buonasera, ' : 'Buongiorno, ';

    if (loading) {
        return <div className="wc-main-content wc-hidden">
            <h1 className="wc-welcome-text wc-hidden">{text}<span className="capitalize"></span></h1>
            <div className="wc-welcome-separator"></div>
        </div>;
    }

    return (
        <div className="wc-main-content">
            <h1 className="wc-welcome-text">{text}<span className="capitalize">{props.name}</span></h1>
            <div className="wc-welcome-separator"></div>
        </div>
    );
}
export default WelcomeComponent;