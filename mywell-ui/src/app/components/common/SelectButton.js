import React, {Component} from 'react'
import PropTypes from 'prop-types';


class SelectButton extends Component {

  constructor() {
    super();

    this.setState({
      selectedIndex: this.props.selectedIndex
    });
  }

  onClick(idx, callback) {
    this.setState({
      selectedIndex: idx
    });

    return callback();
  }

  getButtons() {
    return this.props.buttonConfig.map((buttonConfig, idx) => {

      let className = "f6 link dim br1 ba ph3 pv2 mb2 dib mid-gray";
      if (idx == this.state.selectedIndex) {
        className="f6 link dim br1 ba ph3 pv2 mb2 dib purple";
      }

      return (
        <button
          className={className}
          key={buttonConfig.name}
          onClick={this.onClick(idx, buttonConfig.callback)}
        >
          {buttonConfig.name}
        </button>);
    })
  }

  render() {
    return (
      <div>
        {this.getButtons()}
      </div>
    );
  }
}

SelectButton.propTypes = {
  buttonConfig: PropTypes.arrayOf(PropTypes.shape({
    callback: PropTypes.func,
    name: PropTypes.string
  })),
  selectedIndex: PropTypes.number.isRequired
};

export default SelectButton;
