import FetchHelper from '../../helpers/FetchHelper';
import React, { Component, ReactNode } from 'react';
import './author-box.css';

export type AuthorBoxSocial = {

    name: string;

    url: string;

    imageUrl: string;
}

interface IAuthorBoxProps {

    name: string;

    igUserName: string;

    body: string;

    imageUrl: string;

    socials: AuthorBoxSocial[]
}

interface IAuthorBoxState {

    loading: boolean;
}

class AuthorBox extends Component<IAuthorBoxProps, IAuthorBoxState> {

    constructor(props: IAuthorBoxProps) {
        super(props);
        this.state = {
            loading: true
        }
    }

    async componentDidMount() {
        this.setState({
            loading: false
        });
        return;
        // CORS blocking
        let res: any;
        let imageUrl: string = '';
        try {
            res = await fetch(
                `https://www.instagram.com/${this.props.igUserName}/?__a=1`
            );
            imageUrl = res.profile_pic_url_hd;
        } catch (err) {
            console.error(err);
            return;
        }
        this.setState({
            loading: false
        });
    }

    render(): ReactNode {
        let img = <img src={this.props.imageUrl} className="ab-author-image"></img>;
        if (this.state.loading) {
            img = <div className="ab-author-image"></div>;
        }
        return (
            <div className="ab-main-content">
                <div className="ab-top">
                    <div className="ab-author-image-wrapper noselect">
                        {img}
                    </div>
                </div>
                <div className="ab-bottom">
                    <div className="ab-author-name">{this.props.name}</div>
                    <div className="ab-body-wrapper">
                        <div className="ab-body">
                            {this.props.body}
                        </div>
                    </div>
                    <div className="ab-socials-wrapper">
                        {this.props.socials.map((s, i) => {
                            return (
                                <a
                                    href={s.url}
                                    className="ab-social noselect"
                                    title={s.name}
                                    key={i}
                                    target="blank"
                                >
                                    <img src={s.imageUrl} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default AuthorBox;