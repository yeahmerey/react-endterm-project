import "./App.css";
import RootLayout from "./components/RootLayout/RootLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import ItemsList from "./pages/ItemsList/ItemsList.jsx";
import ItemDetails from "./pages/ItemDetails/ItemDetails.jsx";

import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="itemsList" element={<ItemsList />} />
          <Route path="itemsList/:id" element={<ItemDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
