import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TablePage from './TablePage';
import SuperTable from './SuperTable';
import Autocomplete from './Autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";
import Dropdown from 'react-bootstrap/Dropdown'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLDqpB2jA1pUG8K7jiafhKjzTjQfilWe0",
  authDomain: "stock-boy-3d183.firebaseapp.com",
  projectId: "stock-boy-3d183",
  storageBucket: "stock-boy-3d183.appspot.com",
  messagingSenderId: "507833524956",
  appId: "1:507833524956:web:b4b743090f1c6af4560a19",
  measurementId: "G-ESNX47QJKM"
};

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("anon sign in failed with error: ", error.code, error.message)
  });

// firebase.auth().onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

var currentCompany = ''

function setDocToList(doc){
  var ticker_list = []
  for (const [key, value] of Object.entries(doc.data())) {
    if(value !== "null"){
      var new_string = key + ": " + value
    }else{
      var new_string = key
    }
    ticker_list.push(new_string)
  }
  return ticker_list
}

async function retrieveTickerData(){
  return getDoc(doc(db, 'single_data', 'trading_symbols')).then(docSnap => { // this is calling twice per page load
    if (docSnap.exists()) {
      console.log("Ticker document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
    return setDocToList(docSnap)
  });
}

async function retrieveCompanyData(company_name){
  return getDoc(doc(db, 'stock_data', company_name)).then(docSnap => { // this is calling twice per page load
    if (docSnap.exists()) {
      console.log("Company document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
    return docSnap.data()
  });
}

function App() {

  const [tickerList, setTickerList] = useState();
  const [company, setCompany] = useState();
  const [companyDict, setCompanyDict] = useState();
  const [currentYear, setCurrentYear] = useState();
  const [yearList, setYearList] = useState();

  const determineYears = (new_dict) => {
    console.log('determining years')
    console.log(new_dict)
    if(typeof new_dict == "undefined" || new_dict == null){
        return
    }
    // console.log("determing years")
    var keys_to_use = Object.keys(new_dict)
    var years_arr = []
    for (var i = 0; i < keys_to_use.length; i++){
        var split_key_array = keys_to_use[i].split('_')
        years_arr.push(split_key_array.at(0))
    }
    
    setYearList(years_arr)
    setCurrentYear(years_arr.at(-1))
    // console.log('error checking in determine years')
    // console.log(this.yearList)
    // console.log(this.currentYear)
    // this.setState({
    //     yearList: years_arr,
    //     currentYear: years_arr[-1]
    // });
  }

  const pull_data = (data) => {
    retrieveCompanyData(data.split(":")[0]).then(new_dict =>{
      console.log("pulling data")
      setCompanyDict(new_dict)
      setCompany(data)
      determineYears(new_dict)
    })    
    // console.log(companyDict) // this is behind for some reason
  }

  // Use an effect to load the ticker list from the database
  useEffect(() => {
    if(typeof tickerList == 'undefined'){ // two api calls happening here for some reason
      retrieveTickerData().then(new_list => {
        setTickerList(new_list)
        // console.log(tickerList)
      })     
    }
    if(currentCompany !== company){
      // setCompany(currentCompany) // hope this works
    }
  });

    return (
      <div>
        {/* <nav class="navbar navbar-light bg-light fixed-top justify-content-between">
          <a class="navbar-brand">Navbar</a>
          <form class="form-inline">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </nav> */}
        <nav class="navbar fixed-top navbar-light bg-primary blue-nav" style={{"padding-top":"2px","padding-bottom":"2px"}}>
          <div class="container-fluid">
            <a class="navbar-brand" style={{color :'white'}} href="#">
              <img src="stockBoy.png" class="d-inline-block align-top" alt="Logo"/>
              {/* Stock Boy */}
            </a>
            <form class="form-inline">
              <Autocomplete id="autocomplete" class="col-md-4" suggestions={tickerList} func={pull_data}/>
            </form>
            <div></div>
            {/* <Form.Check disabled
                type="switch"
                label="simple"
                id="disabled-custom-switch"
                onChange={(checked) => {
                    { this.simplify = checked }
                }}
            /> */}
          </div>
        </nav>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <SuperTable company={company} companyDict={companyDict} yearList={yearList} currentYear={currentYear}/>
        </div>
      </div>
    );
  }

export default App;

// this is code for the bottom header for mobile app
{/* <nav class="navbar fixed-bottom navbar-light bg-primary blue-nav">
          <div class="container-fluid">
            <form class="form-inline">
              <Autocomplete id="autocomplete" suggestions={tickerList} func={pull_data}/>
            </form>
            <DropdownButton id="dropdown-basic-button" title={currentYear}>
              {renderDropdownMenu}
            </DropdownButton>
          </div>
        </nav> */}
