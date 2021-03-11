import { equal } from "assert";
import "./TeacherPage.css";

function test() {
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

  return (
    <div>
      <div className="tp-items">
        <div className="tp-wrapper">
          <div className="tp-buttons-wrapper">
            <input
              type="submit"
              className="tp-class-button"
              tabIndex={3}
              value="Classi"
              onClick={() => {
                let el = document.getElementById("tp-class-table");
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
              }}
            />
            <input
              type="submit"
              className="tp-subjects-button"
              tabIndex={3}
              value="Materie"
              onClick={() => {
                let el = document.getElementById("tp-subjects-table");
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
              }}
            />
          </div>
          <br></br>

          <div>
            <table className="tp-subjects-table" id="tp-subjects-table">
              <tr>
                <td onClick={() => tdClick("tp-class-table")}>Modulo 122</td>
              </tr>
              <tr>
                <td onClick={() => tdClick("tp-class-table")}>Modulo 123</td>
              </tr>
              <tr>
                <td onClick={() => tdClick("tp-class-table")}>Modulo 141</td>
              </tr>
            </table>
          </div>

          <br></br>

          <div>
            <table className="tp-class-table" id="tp-class-table">
              <tr>
                <td onClick={() => tdClick("tp-students-table")}>I1A</td>
              </tr>
              <tr>
                <td onClick={() => tdClick("tp-students-table")}>I1B</td>
              </tr>
              <tr>
                <td onClick={() => tdClick("tp-students-table")}>I2A</td>
              </tr>
              <tr>
                <td onClick={() => tdClick("tp-students-table")}>I2B</td>
              </tr>
              <tr>
                <td onClick={() => tdClick("tp-students-table")}>I3A</td>
              </tr>
            </table>
          </div>

          <br></br>

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
        </div>
      </div>
    </div>
  );
}

export default test;
