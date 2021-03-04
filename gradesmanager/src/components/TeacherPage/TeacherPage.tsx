import "./TeacherPage.css";

function test() {
  return (
    <div>
      <div className="tp-buttons-wrapper">
        <input
          type="submit"
          className="tp-class-button"
          tabIndex={3}
          value="Classi"
        />
        <input
          type="submit"
          className="tp-subjects-button"
          tabIndex={3}
          value="Materie"
        />
      </div>
      <br></br>

      <div>
        <table className="tp-subjects-table">
          <tr>
            <td>Modulo 122</td>
          </tr>
          <tr>
            <td>Modulo 123</td>
          </tr>
          <tr>
            <td>Modulo 141</td>
          </tr>
        </table>
      </div>

      <br></br>

      <div>
        <table className="tp-class-table">
          <tr>
            <td>I1A</td>
          </tr>
          <tr>
            <td>I1B</td>
          </tr>
          <tr>
            <td>I2A</td>
          </tr>
          <tr>
            <td>I2B</td>
          </tr>
          <tr>
            <td>I3A</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default test;
