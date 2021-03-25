import AboutPage from './components/AboutPage/AboutPage';
import AuthorsPage from './components/AuthorsPage/AuthorsPage';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import TeacherPage from './components/TeacherPage/TeacherPage';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/teachers" component={TeacherPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/authors" component={AuthorsPage} />
          <Route path="/:uuid" render={(props) => <HomePage uuid={props.match.params.uuid} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
