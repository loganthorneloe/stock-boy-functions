import './App.css';
import SuperTable from './SuperTable';
import Autocomplete from './Autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import React, { useState, useEffect } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";

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

const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    console.log("anon sign in failed with error: ", error.code, error.message)
  });

var currentCompany = ''

function setDocToList(doc){
  var ticker_list = []
  for (const [key, value] of Object.entries(doc.data())) {
    if(value !== "null"){
      var new_string = key + ": " + value
    }else{
      new_string = key
    }
    ticker_list.push(new_string)
  }
  return ticker_list
}

async function retrieveTickerData(){
  return getDoc(doc(db, 'single_data', 'trading_symbols')).then(docSnap => { // this is calling twice per page load
    if (docSnap.exists()) {
      // console.log("Ticker document data:", docSnap.data());
    } else {
      console.log("No such document for tickers!");
    }
    return setDocToList(docSnap)
  });
}

async function retrieveCompanyData(company_name){
  return getDoc(doc(db, 'stock_data', company_name)).then(docSnap => { // this is calling twice per page load
    if (docSnap.exists()) {
      //console.log("Company document data:", docSnap.data());
    } else {
      console.log("No such document with name: ", company_name);
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
    if(typeof new_dict == "undefined" || new_dict == null){
        return
    }
    var keys_to_use = Object.keys(new_dict)
    var years_arr = []
    for (var i = 0; i < keys_to_use.length; i++){
        var split_key_array = keys_to_use[i].split('_')
        years_arr.push(split_key_array[0])
    }
    
    setYearList(years_arr)
    setCurrentYear(years_arr[years_arr.length-1])
  }

  const pull_data = (data) => {
    retrieveCompanyData(data.split(":")[0]).then(new_dict =>{
      setCompanyDict(new_dict)
      setCompany(data)
      determineYears(new_dict)
    })    
  }

  // Use an effect to load the ticker list from the database
  useEffect(() => {
    if(typeof tickerList == 'undefined'){ 
      retrieveTickerData().then(new_list => {
        setTickerList(new_list)
      })     
    }
    if(currentCompany !== company){
    }
  });

    return (
      <div>
        <nav className="navbar fixed-top navbar-light bg-primary blue-nav" style={{"paddingTop":"2px","paddingBottom":"2px"}}>
          <div className="container-fluid">
            <a className="navbar-brand" href="#home" style={{color :'white'}}>
              <img src="stockBoy.png" className="d-inline-block align-top" onClick={() => window.location.reload()} alt="Logo"/>
            </a>
            <form className="form-inline">
              <Autocomplete id="autocomplete" className="col-md-4" suggestions={tickerList} func={pull_data}/>
            </form>
            <div></div>
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
