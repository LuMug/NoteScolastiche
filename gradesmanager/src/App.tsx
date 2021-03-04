import AboutButton from "./components/about-button/AboutButton";
import AboutPage from "./components/AboutPage/AboutPage";
import GradePrompt from "./components/grade-prompt/GradePrompt";
import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/LoginPage/LoginPage";
import SubjectPage from "./components/SubjectPage/SubjectPage";
import { BrowserRouter, Switch } from "react-router-dom";
import { Route, Router } from "react-router-dom";
import TeacherPage from "./components/TeacherPage/TeacherPage";

function App() {
  return (
    <div className="root">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/teachers" component={TeacherPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/test" component={GradePrompt} />
        </Switch>
        {/* <Route exact path="/subjects/:suid" component={SubjectPage} /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
