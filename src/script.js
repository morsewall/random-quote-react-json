"use strict";

//defining variable to be populated with JSON content
let quotes;

//defining the stateful component. This creates the JavaScript class App that extends the React.Component class. With this, App can now access React features.
class App extends React.Component {
  constructor(props) {
    super(props);
    //binding the class methods defined further below. This way the class methods can use this to access properties on the class (such as state) inside the scope of the method.
    this.random = this.random.bind(this);
    this.randomQuoteFunction = this.randomQuoteFunction.bind(this);
    this.chosenRandomQuoteToState = this.chosenRandomQuoteToState.bind(this);
    //defining the component initial state. Initializing state.
    this.state = {
      quoteTextChosen: "",
      quoteAuthorChosen: ""
    };
  }

  //asynchronous function that fetches JSON content, populates the quotes array and updates state with a quote (following the fetch being complete)
  async componentDidMount() {
    const responseJSON = await fetch(
      "https://cdn.jsdelivr.net/gh/morsewall/jsondb@master/db.json"
    );
    const responseObject = await responseJSON.json();
    quotes = responseObject.quotes;
    let quote = this.randomQuoteFunction(quotes);
    this.setState({
      quoteTextChosen: quote.quoteText,
      quoteAuthorChosen: quote.quoteAuthor
    });
  }

  random(array) {
    return Math.floor(Math.random() * array.length);
  }

  randomQuoteFunction(array) {
    return array[this.random(array)];
  }

  //defining a new class method (chosenRandomQuoteToState) to update the state with a new quote
  chosenRandomQuoteToState() {
    let newQuote = this.randomQuoteFunction(quotes);
    this.setState({
      quoteTextChosen: newQuote.quoteText,
      quoteAuthorChosen: newQuote.quoteAuthor
    });
  }

  //the component returns JSX, and as per code snippet below, JSX clearly represents HTML, composing the UI.
  render() {
    //making the machine tweet
    let twitterLink;
    let quoteTextElem = this.state.quoteTextChosen;
    let quoteAuthorElem = " - " + this.state.quoteAuthorChosen;
    let contentQuote = quoteTextElem + quoteAuthorElem;
    if (contentQuote.length > 280) {
      let charCountAuthor = quoteAuthorElem.length;
      const extraStylingChar = "..." + '"';
      let extraCharCount = extraStylingChar.length;
      let subString =
        quoteTextElem.substring(0, 280 - extraCharCount - charCountAuthor) +
        extraStylingChar +
        quoteAuthorElem;
      //generate url available for Twitter intent and inject url on HTML
      twitterLink = "https://twitter.com/intent/tweet?text=" + subString;
    } else {
      //generate url available for Twitter intent and inject url on HTML
      twitterLink = "https://twitter.com/intent/tweet?text=" + contentQuote;
    }
    return (
      //as a React component can only return one single element, I’m using <React.Fragment> to add a parent tag to my JSX elements without adding an extra node to the DOM.
      <React.Fragment>
        <div className="container">
          <div id="quote-box">
            <div className="quotable-square">
              <div className="content">
                <div id="text">{this.state.quoteTextChosen}</div>
                <div id="author" className="author">
                  {this.state.quoteAuthorChosen}
                </div>
              </div>
            </div>
            <div className="actions">
              <button
                id="new-quote"
                className="new-quote"
                onClick={this.chosenRandomQuoteToState}
              >
                Get New Quote
              </button>
              <button className="tweet-quote">
                <a id="tweet-quote" href={twitterLink} target="_blank">
                  <i className="fab fa-twitter"></i>Tweet Quote
                </a>
              </button>
            </div>
          </div>
        </div>
        <footer>
          <ul className="footer-options">
            <li className="footer-link">
              <a href="#" className="footer-linktext">
                Legal
              </a>
            </li>
            <li className="footer-link">
              <a href="#" className="footer-linktext">
                Contact Us
              </a>
            </li>
          </ul>
          <span>© 2019 Developed by Pat Eskinasy. All Rights Reserved.</span>
        </footer>
      </React.Fragment>
    );
  }
}

//placing JSX into React’s own DOM
ReactDOM.render(<App />, document.getElementById("app"));
