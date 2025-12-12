import "./App.css";
import RootLayout from "./components/RootLayout/RootLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import ItemsList from "./pages/ItemsList/ItemsList.jsx";
import ItemDetails from "./pages/ItemDetails/ItemDetails.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import Favorites from "./pages/Favorites/Favorites.jsx";

import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="itemsList" element={<ItemsList />} />
              <Route path="itemsList/:id" element={<ItemDetails />} />
              <Route path="favorites" element={<Favorites />} />

              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />

              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
