import React, { Component, Fragment } from "react";
import './Autocomplete.css'
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyDLDqpB2jA1pUG8K7jiafhKjzTjQfilWe0",
    authDomain: "stock-boy-3d183.firebaseapp.com",
    projectId: "stock-boy-3d183",
    storageBucket: "stock-boy-3d183.appspot.com",
    messagingSenderId: "507833524956",
    appId: "1:507833524956:web:b4b743090f1c6af4560a19",
    measurementId: "G-ESNX47QJKM"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function setDocToList(doc){
    var ticker_list = []
    for (const [key, value] of Object.entries(doc.data())) {
      var new_string = key + ": " + value
      ticker_list.push(new_string)
    }
    // trading_symbols = ticker_list
    // console.log("stocks: ", trading_symbols)
    return ticker_list
  }

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      suggestions: ["orange"]
    };
  }

  componentDidMount() {
    // var db = this.props
    this.retrieveData();
  }

  retrieveData(){
    getDoc(doc(db, 'single_data', 'trading_symbols')).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      var retrieved_suggestions = setDocToList(docSnap)
      this.setState({
        suggestions: retrieved_suggestions
      })
    });
  }

  onChange = e => {
    // const { suggestions } = this.state.suggestions;
    const userInput = e.currentTarget.value;
  
    const filteredSuggestions = this.state.suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
  
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };

  onClick = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };

  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;
  
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
        suggestions
      }
    } = this;

    let suggestionsListComponent;
  
    if (showSuggestions && userInput) {
        if (filteredSuggestions.length) {
          suggestionsListComponent = (
            <ul class="suggestions">
              {filteredSuggestions.map((suggestion, index) => {
                let className;
      
                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                  className = "suggestion-active";
                }
                return (
                  <li className={className} key={suggestion} onClick={onClick}>
                    {suggestion}
                  </li>
                );
              })}
            </ul>
          );
        } else {
          suggestionsListComponent = (
            <div class="no-suggestions">
              <em>No suggestions available.</em>
            </div>
          );
        }
      }

      return (
        <Fragment>
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"
            type="text"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          {suggestionsListComponent}
        </Fragment>
      );
    }
  }
  
  export default Autocomplete;
