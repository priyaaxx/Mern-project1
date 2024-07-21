import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedPage from "./components/ProtectedPage";
import LandingPage from "./pages/Landing";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import Admin from "./pages/Admin";
import Men from "./pages/Men";
import Women from "./pages/Women";
import ProductInfo from "./pages/ProductInfo";
import Kids from "./pages/Kids";
import Accessories from "./pages/Accessories";
import Footwear from "./pages/Footwear";
import CropTops from "./pages/CropTops";
import Shirts from "./pages/Shirts";
import KoreanTrousers from "./pages/KoreanTrousers.js";
import Dresses from "./pages/Dresses/index.js";

function App() {
  const {loading} = useSelector(state => state.loaders);
  return (
    <div>
      {loading && <Spinner/>}
        <BrowserRouter>
          <Routes>
              <Route path ="/home" element={<ProtectedPage><Home /></ProtectedPage>} />
              <Route path ="/product/:id" element={<ProtectedPage><ProductInfo /></ProtectedPage>} />
              <Route path ="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
              <Route path ="/admin" element={<ProtectedPage><Admin /></ProtectedPage>} />
              <Route path = "/" element={<LandingPage/>} />
              <Route path ="/login" element={<Login />} />
              <Route path ="/men" element={<ProtectedPage><Men /></ProtectedPage>} />
              <Route path ="/women" element={<ProtectedPage><Women /></ProtectedPage>} />
              <Route path ="/kids" element={<ProtectedPage><Kids /></ProtectedPage>} />
              <Route path ="/accessories" element={<ProtectedPage><Accessories /></ProtectedPage>} />
              <Route path ="/footwear" element={<ProtectedPage><Footwear /></ProtectedPage>} />
              <Route path ="/croptops" element={<ProtectedPage><CropTops /></ProtectedPage>} />
              <Route path ="/solidshirts" element={<ProtectedPage><Shirts /></ProtectedPage>} />
              <Route path ="/koreantrousers" element={<ProtectedPage><KoreanTrousers /></ProtectedPage>} />
              <Route path ="/dresses" element={<ProtectedPage><Dresses /></ProtectedPage>} />
              <Route path ="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
