import React, {Component} from 'react'
import PropTypes from 'prop-types';


class SelectButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: props.selectedIndex
    };
  }

  onClick(idx, callback) {
    this.setState({
      selectedIndex: idx
    });

    return callback();
  }

  getButtons() {
    return this.props.buttonConfig.map((buttonConfig, idx) => {

      let className = "f5 no-underline white bg-dark-gray bg-animate inline-flex items-center pa3 ba  b--dark-gray border-box";
      if (idx == this.state.selectedIndex) {
        className="f5 no-underline dark-gray bg-animate inline-flex items-center pa3 ba border-box";
      }

      return (
        <a
          className={className}
          key={buttonConfig.name}
          onClick={() => this.onClick(idx, buttonConfig.callback)}
        >
          <span className="pl2 lr2">{buttonConfig.name}</span>
        </a>);
    })
  }

  render() {
    return (
      <div className="flex items-center justify-center pa2">
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
