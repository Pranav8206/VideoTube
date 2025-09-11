import { useState } from "react";
import Home from "./pages/Home.jsx"
import Navbar from "./components/Navbar.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar/>
      <Home />
    </>
  );
}

export default App;
