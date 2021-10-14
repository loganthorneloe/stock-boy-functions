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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

var currentCompany = ''

function setDocToList(doc){
  var ticker_list = []
  for (const [key, value] of Object.entries(doc.data())) {
    var new_string = key + ": " + value
    ticker_list.push(new_string)
  }
  return ticker_list
}

async function retrieveTickerData(){
  return getDoc(doc(db, 'single_data', 'trading_symbols')).then(docSnap => { // this is calling twice per page load
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
    return setDocToList(docSnap)
  });
}

async function retrieveCompanyData(company_name){
  getDoc(doc(db, 'stock_data', company_name)).then(docSnap => { // this is calling twice per page load
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
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

  // Use an effect to load the ticker list from the database
  useEffect(() => {
    if(typeof tickerList == 'undefined'){ // two api calls happening here for some reason
      retrieveTickerData().then(new_list => {
        setTickerList(new_list)
        console.log(tickerList)
      })     
    }
    if(currentCompany !== company){
      // setCompany(currentCompany) // hope this works
    }
  });

  const pull_data = (data) => {
    setCompany(data)
    retrieveCompanyData(data.split(":")[0]).then(new_dict =>{
      setCompanyDict(new_dict)
    })     
    console.log(companyDict) // this is behind for some reason
  }

    return (
      <div>
        <div>
          <h1>Stock Boy</h1>
          <Autocomplete id="autocomplete" suggestions={tickerList} func={pull_data}/>
        </div>
        <SuperTable company={company} companyDict={companyDict}/>
      </div>
    );
  }

export default App;
