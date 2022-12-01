import './App.css';

import FrontPage from './FrontPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, collection } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";
import DataPage from './DataPage';
import BottomPage from './BottomPage';
import { prelim_tickers } from  './Tickers';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { faSpinner, faMagnifyingGlass, faHouse, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import Socials from './Socials'
import SearchBar from './SearchBar';
import Loading from './Loading';

library.add(faSpinner, faMagnifyingGlass, faHouse, faCircleQuestion)

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

var cacheDict = {}

async function retrieveCompanyData(cik){
  if (cik in cacheDict){
    // console.log('cacheDict hit for cik ' + cik)
    return cacheDict[cik]
  }
  var data = {}
  const docRef = doc(db, "data_v2", cik)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    data["data"] = docSnap.data()
  } else {
    data["data"] = "undefined"
    // console.log("No such analyzed with cik: ", cik);
  }
  const docRef2 = doc(db, "financial_links", cik)
  const docSnap2 = await getDoc(docRef2)
  if (docSnap2.exists()) {
    data["financials"] = docSnap2.data()
  } else {
    data["financials"] = "undefined"
    // console.log("No such financial statements with cik: ", cik);
  }
  // console.log('setting in cache dict')
  cacheDict[cik] = data;
  return data
}

async function retrieveFrontPageInfo(){
  var companies = []
  var num_fundamentals = 0
  const querySnapshot = await getDocs(collection(db, "front_page_info"));
  querySnapshot.forEach((doc) => {
    if(doc.id === "dailies"){
      var data = doc.data()
      Object.keys(data).forEach(cik =>
        companies.push([data[cik]["name"] + "?" + cik, data[cik]])
      )
    }
    if(doc.id === "info"){
      num_fundamentals = doc.data()["total_fundamentals"]
    }
  });
  return [companies, num_fundamentals]
}

async function addToCompanies(companies, companyFinancialsDict, company, companyDataDict, confidence){
  var currentCompany = {
    "financials" : companyFinancialsDict,
    "company" : company,
    "data" : companyDataDict,
    "confidence" : confidence
  }

  var tmp = []
  if (companies === undefined) {
    tmp.push(currentCompany)
    return tmp
  } 
  tmp = companies
  for (const element of tmp){
    if (element["company"] === company){
      tmp.splice(tmp.indexOf(element), 1);
      break
    }
  }
  tmp.push(currentCompany)  
  if (tmp.length > 10){
    tmp.shift()
  }
  return tmp
}

function App() {

  const [tickerList, setTickerList] = useState([]);
  const [company, setCompany] = useState();
  const [loading, setLoading] = useState();
  const [tenCompaniesList, setTenCompaniesList] = useState();
  const [companies, setCompanies] = useState();
  const [numFundamentals, setNumFundamentals] = useState();

  const pull_data = (selection) => {
    var split_selection = selection.split("\n")
    if(split_selection.length !== 2){
      split_selection = selection.split("?")
    }
    
    setLoading(true)
    retrieveCompanyData(split_selection[1]).then(new_dict =>{
      addToCompanies(companies, new_dict["financials"], split_selection[0], new_dict["data"], new_dict["confidence"]).then(temp_recents => {
        setCompanies(temp_recents)
        setCompany(split_selection[0])
      })
      setLoading(false)
    })
  }

  const reset = () => {
    setCompany(undefined)
  }

  useEffect(() => {
    if(tickerList.length === 0){
      setTickerList(prelim_tickers)
      retrieveFrontPageInfo().then(data_tuple =>{
        setTenCompaniesList(data_tuple[0])
        setNumFundamentals(data_tuple[1])
      })
    }
    if(currentCompany !== company){
    }
  }, [tickerList.length, company]);

  if(loading){
    return (
      <div>
        <div className="content">
          <Loading/>        
        </div>
      </div>
    );
  }else if(typeof companyDict === "undefined" && typeof company === "undefined"){
    return (
      <div>
        <SearchBar suggestions={tickerList} func={pull_data} reset={reset}/>
        <div className="content">
          <FrontPage tenCompaniesList={tenCompaniesList} numFundamentals={numFundamentals} func={pull_data}/>
        </div>
        <Socials/>
        <BottomPage/>
      </div>
    );
  }else{
    return (
      <div>
        <SearchBar suggestions={tickerList} func={pull_data} reset={reset}/>
        <div className="content" align="center">
          <DataPage companies={companies}/>
        </div>
        <Socials/>
        <BottomPage/>
      </div>
    );
  }
}

export default App;
