import { Component, ReactNode } from "react";
import "./slider.css";

interface ISliderProps {}

class Slider extends Component<ISliderProps> {
  constructor(props: ISliderProps) {
    super(props);
  }

  render(): ReactNode {
    return (
      <div>
        <label className="form-switch">
          <input type="checkbox" />
          <i></i>
        </label>
      </div>
    );
  }
}

export default Slider;
