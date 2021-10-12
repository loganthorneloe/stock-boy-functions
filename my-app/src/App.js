import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TablePage from './TablePage';
import Autocomplete from './Autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

const countries = [
  "MSFT",
  "AAPL"
]
  return (
    <div>
      <div>
        <h1>Stock Boy</h1>
        <Autocomplete suggestions={["Oranges", "Apples", "Banana", "Kiwi", "Mango"]}/>
      </div>
      <TablePage></TablePage>
    </div>
  );
}

export default App;
