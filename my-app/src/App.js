import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TablePage from './TablePage';
import Autocomplete from './Autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import ReactDOM from 'react-dom';

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

// var trading_symbols = ["oranges", "apples", "bananas"]

// function setDocToList(doc){
//   var ticker_list = []
//   for (const [key, value] of Object.entries(doc.data())) {
//     var new_string = key + ": " + value
//     ticker_list.push(new_string)
//   }
//   trading_symbols = ticker_list
//   console.log("stocks: ", trading_symbols)
//   return ticker_list
// }

// getting data
// function retrieveData(){
  // getDoc(doc(db, 'single_data', 'trading_symbols')).then(docSnap => {
  //   if (docSnap.exists()) {
  //     console.log("Document data:", docSnap.data());
  //   } else {
  //     // doc.data() will be undefined in this case
  //     console.log("No such document!");
  //   }
  //   return setDocToList(docSnap);
  // });
// }

// const element = <Autocomplete suggestions={retrieveData()}/>
// ReactDOM.render(
//   element,
//   document.getElementById('autocomplete')
// );

// Get a list of cities from your database
// async function getTickers(db) {
//   const docRef = doc(db, 'single_data', 'trading_symbols');
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
//   } else {
//     // doc.data() will be undefined in this case
//     console.log("No such document!");
//   }
//   var ticker_list = []
//   for (const [key, value] of Object.entries(docSnap.data())) {
//     var new_string = key + ": " + value
//     ticker_list.push(new_string)
//   }
//   stocks = ticker_list
// }

function App() {

    return (
      <div>
        <div>
          <h1>Stock Boy</h1>
          <Autocomplete database={db}/>
        </div>
        <TablePage></TablePage>
      </div>
    );
  }

export default App;
