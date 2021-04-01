import FetchHelper from "../../helpers/FetchHelper";
import Page from "../Page/Page";
import React, { useEffect, useState } from "react";
import { IUser, IUserSubject } from "../../@types";
import "./TeacherPage.css";

const TeacherPage = () => {
  const [showGroups, setShowGroups] = useState(true);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [subjects, setSubjects] = useState<IUser[] | null>(null);
  const [groups, setGroups] = useState<IUser[] | null>(null);

  const getUsers = async () => {
    try {
      return FetchHelper.fetch("/users");
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const getSubjects = async () => {
    try {
      return FetchHelper.fetch("/users");
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const getGroups = async () => {
    try {
      return FetchHelper.fetch("/users");
    } catch (err) {
      console.error(err);
      return;
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setUsers(await getUsers());
      setSubjects(await getSubjects());
      setGroups(await getGroups());
    };
    fetch();
  }, [showGroups]);

  const onShowGroups = () => {
    setShowGroups((ps) => !ps);
  };

  const onShowSubjects = () => {
    setShowSubjects((ps) => !ps);
  };

  let tdClick = (o: string) => {
    let el = document.getElementById(o);
    if (el) {
      let display = el.style.display;
      if (el && display == "none") {
        el.style.display = "block";
        el.style.visibility = "visible";
      } else {
        el.style.display = "none";
        el.style.visibility = "hidden";
      }
    }
  };

  let topTable;
  let botTable;

  if (!users) {
    return <h1>loading</h1>;
  }

  if (!subjects) {
    return <h1>loading</h1>;
  }

  if (!groups) {
    return <h1>loading</h1>;
  }

  if (showGroups) {
    topTable = (
      <div>
        <table className="tp-class-table" id="tp-class-table">
          {users.map((u, i) => {
            return (
              <tr key={i}>
                <td onClick={() => tdClick("tp-students-table")}>{u.name}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
  if (showSubjects) {
    topTable = (
      <div>
        <table className="tp-subject-table" id="tp-subject-table">
          {users.map((u, i) => {
            return (
              <tr key={i}>
                <td onClick={() => tdClick("tp-students-table")}>{u.name}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
  if (showStudents) {
    botTable = (
      <div>
        <table className="tp-students-table" id="tp-students-table">
          <tr>
            <td>Nicola Ambrosetti</td>
          </tr>
          <tr>
            <td>Francisco Viola</td>
          </tr>
          <tr>
            <td>Aris Previtali</td>
          </tr>
          <tr>
            <td>Ismael Trentin</td>
          </tr>
        </table>
      </div>
    );
  }

  return (
    <Page displayPrompt={false} user={null}>
      <div className="tp-main-content">
        <div className="tp-wrapper">
          <div className="tp-buttons-wrapper">
            <input
              type="submit"
              className="tp-class-button"
              tabIndex={3}
              value="Classi"
              onClick={() => onShowGroups()}
            />
            <input
              type="submit"
              className="tp-subjects-button"
              tabIndex={3}
              value="Materie"
              onClick={() => onShowSubjects()}
            />
          </div>
          {topTable}
          {botTable}
        </div>
      </div>
    </Page>
  );
};

export default TeacherPage;
