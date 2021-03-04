import AboutPage from './components/AboutPage/AboutPage';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import TeacherInfobox from './components/teacher-infobox/TeacherInfobox';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/test" component={TeacherInfobox} />
        </Switch>
        {/* <Route exact path="/subjects/:suid" component={SubjectPage} /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
