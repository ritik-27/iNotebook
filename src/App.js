import './App.css';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Notestate from './context/notes/notestate';
import Alert from './components/Alert';

function App() {
  return (
    <>
      <Notestate>
        <Router>
          <Navbar />
          <Alert message={"sucess"}/>
          <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
          </div>
        </Router>
      </Notestate>
    </>
  );
}

export default App;