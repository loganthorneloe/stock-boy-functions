import React, { Component, Fragment } from "react";
import './Autocomplete.css'


const numResults = 20

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      showEndStatement: false
    };
  }

  onChange = e => {
    const { suggestions } = this.props;
    const lowerSuggestions = suggestions.map(s => s.toLowerCase())
    const userInput = e.currentTarget.value.toLowerCase();
    this.setState({
      showEndStatement: false
    });
    const filteredSuggestions = [];   
    for (let i = 0; i < suggestions.length; i++) {
      if (lowerSuggestions[i].indexOf(userInput) > -1 && userInput !== "") {
        filteredSuggestions.push(suggestions[i]);
      }
      if(filteredSuggestions.length >= numResults){
        this.setState({
          showEndStatement: true
        });
        break
      }
    }
  
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
      userInput: e.currentTarget.innerText,
      showEndStatement: false
    }, () => {
        this.props.func(this.state.userInput)
        this.setState({ userInput: "" });
    });
  };

  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;
  
    if (e.keyCode === 13) {
      e.preventDefault()
      if(filteredSuggestions.length !== 0){
        this.setState({
          activeSuggestion: 0,
          filteredSuggestions: [],
          showSuggestions: false,
          userInput: filteredSuggestions[activeSuggestion],
          showEndStatement: false
        }, () => {
          this.props.func(this.state.userInput)
          this.setState({ userInput: "" });
        });
      }
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

  stripCik = (suggestionNameAndTicker) => {
    var second = suggestionNameAndTicker.split(':')
    if (second.length > 1){
      if(second[1].toLowerCase().includes('cik')){
        return second[0]
      }
    }
    return suggestionNameAndTicker
  }

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
        showEndStatement
      }
    } = this;

    let suggestionsListComponent;
  
    if (showSuggestions && userInput) {
        if (filteredSuggestions.length) {
          suggestionsListComponent = (
            <ul className="suggestions">
              {filteredSuggestions.map((suggestion, index) => {
                let className;
      
                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                  className = "suggestion-active";
                }
                return (
                  <li className={className} key={suggestion} onClick={onClick}>
                    <strong>{this.stripCik(suggestion.split('?')[0])}</strong>
                    <div></div>
                    {suggestion.split('?')[1]}
                  </li>
                );
              })}
              {showEndStatement && <ul><i>Showing first {numResults} results...</i></ul>}
            </ul>
          );
        } 
      }

      return (
        <Fragment>
          <input id="not_autofill" className="form-control" style={{borderRadius: '50px'}} autoComplete="off" type="search" placeholder="Search for a company..." aria-label="Search"
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
