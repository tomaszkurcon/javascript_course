class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counterValue: props.initial,
      delay: props.delay,
      isRunning: false,
    };
  }
  interval = null;
  startCounter = () => {
    this.setState({ isRunning: true });
    this.interval = setInterval(() => {
      this.setState({ counterValue: this.state.counterValue + 1 });
    }, this.state.delay);
  };
  stopCounter = () => {
    this.setState({ isRunning: false });
    clearInterval(this.interval);
  };

  render() {
    return (
      <React.Fragment>
        <div className="counter-container">
          <span>Counter→</span>
          <span className="counter">{this.state.counterValue}</span>
          <br />
          <button
            className="start"
            onClick={this.startCounter}
            disabled={this.state.isRunning}
          >
            Start
          </button>
          <button
            className="stop"
            disabled={!this.state.isRunning}
            onClick={this.stopCounter}
          >
            Stop
          </button>
        </div>
      </React.Fragment>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>setInterval() / setTimeout()</h1>
        <div className="counter-list">
          <Counter initial={11} delay={2000} />
          <Counter initial={0} delay={100} />
        </div>
      </React.Fragment>
    );
  }
}

const container = document.getElementById("root"); // Pobieranie referencji na kontener
const root = ReactDOM.createRoot(container); // Tworzenie korzenia React-a dla podanego kontenera
root.render(<App />); // Renderowanie komponentu
