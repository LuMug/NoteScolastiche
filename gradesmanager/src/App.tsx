import AboutButton from './components/about-button/AboutButton';
import AboutPage from './components/AboutPage/AboutPage';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import SubjectPage from './components/SubjectPage/SubjectPage';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Route, Router } from 'react-router-dom';

function App() {
  return (
    <div className="root">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/about" component={AboutPage} />
        </Switch>
        {/* <Route exact path="/subjects/:suid" component={SubjectPage} /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
