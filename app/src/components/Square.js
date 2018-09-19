import React, { Component } from 'react';

class Square extends Component {
    render() {
        let {value} = this.props;
        return (
            <button onClick={this.props.onClick} className="square">
            {value}
                {/* TODO */}
            </button>
        );
    }
}

export default Square;