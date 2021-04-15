import { Component, ReactNode } from 'react';
import './slider.css';

interface ISliderProps {

  onChangeState: (on: boolean) => void;
}

class Slider extends Component<ISliderProps> {
  constructor(props: ISliderProps) {
    super(props);
  }

  render(): ReactNode {
    return (
      <div className="slider-main-content">
        <label className="form-switch">
          <input type="checkbox" onChange={e => this.props.onChangeState((e.target.value == 'true') ? true : false)} />
          <i></i>
        </label>
      </div>
    );
  }
}

export default Slider;
