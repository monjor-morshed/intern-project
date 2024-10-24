import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Templates from "./pages/Templates";
import CreateTemplate from "./pages/CreateTemplate";
import UserProfile from "./pages/UserProfile";
// import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
const App = () => {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/templates" element={<Templates />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/create-template" element={<CreateTemplate />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
