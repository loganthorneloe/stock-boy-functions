import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TablePage from './TablePage';
import Autocomplete from './Autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

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

// Get a list of cities from your database
async function getStocks(db) {
  const stockCol = collection(db, 'stock_data');
  // const stockSnapshot = await getDocs(stockCol);
  // const stockList = stockSnapshot.docs.map(doc => doc.data());
  // console.log(stockList)
  var stockList = []
  return stockList;
}

// Get a list of cities from your database
async function getTradingSymbols(db) {
  const stockCol = collection(db, 'stock_data');
  const stockSnapshot = await getDocs(stockCol);
  const stockList = stockSnapshot.docs.map(doc => doc.data());
  console.log(stockList.keys())
  return stockList;
}

function App() {

  const stocks = getStocks(db) 

    return (
      <div>
        <div>
          <h1>Stock Boy</h1>
          <Autocomplete suggestions={stocks}/>
        </div>
        <TablePage></TablePage>
      </div>
    );
  }

export default App;
