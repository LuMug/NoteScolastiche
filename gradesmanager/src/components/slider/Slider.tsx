import './slider.css';

interface ISliderProps {

  default?: boolean;

  onChangeState?: (on: boolean) => void;
}

const Slider: React.FunctionComponent<ISliderProps> = (props) => {
  let def = (props.default) ? true : false;
  return (
    <div className="slider-main-content">
      <label className="form-switch">
        <input type="checkbox" defaultChecked={def} onChange={e => {
          if (props.onChangeState) {
            props.onChangeState(e.target.checked);
          }
        }} />
        <i></i>
      </label>
    </div>
  );
}

export default Slider;
