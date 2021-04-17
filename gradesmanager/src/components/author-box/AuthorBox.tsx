import FetchHelper from '../../helpers/FetchHelper';
import React, { Component, ReactNode, useEffect } from 'react';
import { useState } from 'react';
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

const AuthorBox: React.FunctionComponent<IAuthorBoxProps> = (props) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // const _fetch = async () => {
        //     setLoading(false);
        //     return;
        //     // CORS blocking
        //     let res: any;
        //     let imageUrl: string = '';
        //     try {
        //         res = await fetch(
        //             `https://www.instagram.com/${this.props.igUserName}/?__a=1`
        //         );
        //         imageUrl = res.profile_pic_url_hd;
        //     } catch (err) {
        //         console.error(err);
        //         return;
        //     }

        // };
        setLoading(false);
    }, [])

    let img = <img src={props.imageUrl} className="ab-author-image"></img>;
    if (loading) {
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
                <div className="ab-author-name">{props.name}</div>
                <div className="ab-body-wrapper">
                    <div className="ab-body">
                        {props.body}
                    </div>
                </div>
                <div className="ab-socials-wrapper">
                    {props.socials.map((s, i) => {
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
export default AuthorBox;