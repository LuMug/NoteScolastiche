import React, { Component } from 'react';
import './HowToList.css';

export interface IHowToListProps {
}


export default class HowToList extends Component<IHowToListProps> {
    constructor(props: IHowToListProps) {
        super(props);
    }
    render() {
        return (
            <div>
          <div className="right-content">
          <div className="le">
            <p className="le-bullet">•</p>
            <div className="le-content">Utilizza l'account di scuola:</div>
          </div>
          <div className="le">
            <p className="le-bullet">•</p>
            <div className="le-content">
              <span className="le-content-lowa">nome.cognome</span>
            </div>
          </div>
          <div className="le">
            <p className="le-bullet">•</p>
            <div className="le-content">
              <span className="le-content-lowa">La tua password</span>
            </div>
          </div>
          <div className="le">
            <p className="le-bullet">•</p>
            <div className="le-content">
              <span className="le-content-lowa">Clicca su </span>Login
            </div>
          </div>
        </div>
      </div>
        );
    }
}
