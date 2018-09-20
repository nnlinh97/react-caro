import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let colorCss = "square " + props.color;
    return (
        <button className={colorCss} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, flag) {
        let color = flag === true ? "yellow" : "";
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                color={color}
            />
        );
    }

    render() {
        let { line } = this.props;
        let col = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                if ((i * 3 + j) === line[0] || (i * 3 + j) === line[1] || (i * 3 + j) === line[2]) {
                    row.push(this.renderSquare(i * 3 + j, true))
                } else {
                    row.push(this.renderSquare(i * 3 + j, false))
                }
            }
            col.push(<div key={i + 5} className="board-row">{row}</div>)
        }
        return (
            <div>
                {col}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            position: [],
            color: [],
            isClicked: -1,
            toggle: false
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).squares) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            position: [...this.state.position, i + 1],
            isClicked: this.state.position.length + 1
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            isClicked: step
        });
    }
    onToggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).squares;
        const line = calculateWinner(current.squares).line;
        const moves = history.map((step, move) => {
            let pos = this.state.position[move - 1];
            let row = pos % 3 === 0 ? Math.floor(pos / 3) : Math.floor(pos / 3) + 1;
            let col = pos % 3 === 0 ? 3 : pos % 3;
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const posNotify = row ? <label> ({col}, {row})</label> : "";
            const btnBold = move === this.state.isClicked ? <b>{desc}</b> :<label>{desc}</label>;
            return (
                <li key={move}>
                    <button className="btn-color" onClick={() => this.jumpTo(move)}>{btnBold}</button>
                    {posNotify}
                </li>
            );
        });
        if(this.state.toggle === true){
            moves.reverse();
        }
        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        if(checkNull(current.squares) === true && line.length === 0){
            setTimeout(() => {
                alert("sorry, no one win!!!");
            }, 1);
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        line={line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={this.onToggle}>Toggle Button</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                squares: squares[a],
                line: lines[i]
            };
        }
    }
    return {
        squares: "",
        line: []
    };
}

function checkNull(array){
    for (let i = 0; i < array.length; i++) {
        if (array[i] === null) {
            return false;
        }
    }
    return true;
}
