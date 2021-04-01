import FetchHelper from '../../helpers/FetchHelper';
import Page from '../Page/Page';
import React, { Component, ReactNode } from 'react';
import { IUser } from '../../@types';
import './admin-page.css';


interface IAdminPageProps {

    uuid: number;
}
interface IAdminPageState {

    user: IUser | null;

    loading: boolean;
}

class AdminPage extends Component<IAdminPageProps, IAdminPageState> {

    constructor(props: IAdminPageProps) {
        super(props);
        this.state = {
            user: null,
            loading: true
        };
    }

    async componentDidMount() {
        try {
            this.setState({
                user: await FetchHelper.fetchUser(this.props.uuid),
                loading: false
            });
        } catch (err) {
            console.error(err);
            return;
        }
    }

    render(): ReactNode {
        if (this.state.loading) {
            return <h1>loading</h1>
        }
        return (
            <Page
                displayPrompt={false}
                user={this.state.user}>
                <div></div>
            </Page>
        );
    }
}

export default AdminPage;