import "./Reset.css";
import './App.css';
import Main from  "./Main/Main.js";
import Header from "./Header/Header.js";
import NavBar from "./Nav Bar/Navbar.js";
import React, { useState,createContext} from "react";

export const UserContext =createContext();
function App() {
  //global use states.
  const [ActiveContent,SetActiveContent] = useState(true);
  const [user, setUser] = useState(false);
  const [adminValid,setAdminValid] = useState(true);
  const [ip,setIp] =useState("209.141.50.150"); //server = 209.141.50.150
  const [protocol, setProtocol] = useState("http://")
  return (
    <UserContext.Provider value={[user, setUser, adminValid, setAdminValid, ip, protocol]}>
      <div className="appWide">
        <Header/>
        <NavBar ActiveContent={ActiveContent} SetActiveContent={SetActiveContent}/>
        <Main ActiveContent={ActiveContent}/>
      </div>
    </UserContext.Provider>
  );
}

export default App;
