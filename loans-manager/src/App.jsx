import "./App.css";
import "./Output.css";
import LoginPage from "./Auth/Login";
import SignupPage from "./Auth/Signup";
import ClientsDashboard from "./Dashboard/Dashboard";
import ClientPage from "./Client/Client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  // const [currentPage, setCurrentPage] = useState("client-page");

  // switch (currentPage) {
  //     case "client-page":
  //         return (<ClientPage />);
  //     case "login":
  //         return (<LoginPage />);
  //     case "signup":
  //         return (<SignupPage />);
  //     default:
  //         return (<ClientsDashboard />);
  // }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<ClientsDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/client/:id" element={<ClientPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
