import arisProfPic from './../../public/img/aris.jpg';
import AuthorBox from '../author-box/AuthorBox';
import discordlogo from './../../public/img/discordlogo.png';
import franciscoProfPic from './../../public/img/francisco.jpg';
import githublogo from './../../public/img/gitlogo_light.png';
import iglogo from './../../public/img/iglogo.png';
import ismaelProfPic from './../../public/img/ismael.jpg';
import nicolaProfPic from './../../public/img/nicola.jpg';
import Page from '../Page/Page';
import { Component, ReactNode } from 'react';
import { IUser } from '../../@types';
import { shuffle } from './../../helpers/ArrayHelper';
import './authors-page.css';


interface IAuthorsPageProps {

    user: IUser;
}

interface IAuthorsPageState {

    panels: JSX.Element[];
}

class AuthorsPage extends Component<IAuthorsPageProps, IAuthorsPageState> {

    constructor(props: IAuthorsPageProps) {
        super(props);
        this.state = {
            panels: [
                <AuthorBox
                    igUserName="nicolaambrosetti"
                    name="Nicola Ambrosetti"
                    body=""
                    imageUrl={nicolaProfPic}
                    socials={[
                        {
                            name: 'Instagram',
                            url: 'https://www.instagram.com/nicolaambrosetti/',
                            imageUrl: iglogo
                        },
                        {
                            name: 'Github',
                            url: 'https://github.com/nicolaambrosetti',
                            imageUrl: githublogo
                        },
                        {
                            name: 'Discord',
                            url: 'https://discordapp.com/users/535506347941429248',
                            imageUrl: discordlogo
                        }
                    ]}
                />,
                <AuthorBox
                    igUserName="aris.prvtli"
                    name="Aris Previtali"
                    body=""
                    imageUrl={arisProfPic}
                    socials={[
                        {
                            name: 'Instagram',
                            url: 'https://www.instagram.com/aris.prvtli/',
                            imageUrl: iglogo
                        },
                        {
                            name: 'Github',
                            url: 'https://github.com/ArisPrevitali',
                            imageUrl: githublogo
                        },
                        {
                            name: 'Discord',
                            url: 'https://discordapp.com/users/265477698682486794',
                            imageUrl: discordlogo
                        }
                    ]}
                />,
                <AuthorBox
                    igUserName="iismapriisma"
                    name="Ismael Trentin"
                    body=""
                    imageUrl={ismaelProfPic}
                    socials={[
                        {
                            name: 'Instagram',
                            url: 'https://www.instagram.com/iismapriisma/',
                            imageUrl: iglogo
                        },
                        {
                            name: 'Github',
                            url: 'https://github.com/IsmaelTrentin',
                            imageUrl: githublogo
                        },
                        {
                            name: 'Discord',
                            url: 'https://discordapp.com/users/319445704969814016',
                            imageUrl: discordlogo
                        }
                    ]}
                />,
                <AuthorBox
                    igUserName="v.fraah"
                    name="Francisco Viola"
                    body=""
                    imageUrl={franciscoProfPic}
                    socials={[
                        {
                            name: 'Instagram',
                            url: 'https://www.instagram.com/v.fraah/',
                            imageUrl: iglogo
                        },
                        {
                            name: 'Github',
                            url: 'https://github.com/franciscoviola',
                            imageUrl: githublogo
                        },
                        {
                            name: 'Discord',
                            url: 'https://discordapp.com/users/272760422736723968',
                            imageUrl: discordlogo
                        }
                    ]}
                />
            ]
        };
    }

    componentDidMount() {
        this.setState({
            panels: shuffle(this.state.panels)
        });
    }

    render(): ReactNode {
        let content =
            <div className="aup-main-content" >
                {this.state.panels.map((p, i) => {
                    return (
                        <div
                            className="aup-author-panel"
                            key={i}
                        >
                            {p}
                        </div>
                    );
                })}
            </div>
        //content = <div className="aup-main-content">a</div>;
        return (
            <Page
                content={content}
                user={this.props.user}
                displayPrompt={false}
            />
        );
    }
}

export default AuthorsPage;