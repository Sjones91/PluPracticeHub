import "./Reset.css";
import './App.css';
import Main from  "./Main/Main.js";
import Header from "./Header/Header.js";
import NavBar from "./Nav Bar/Navbar.js";
import React, { useState} from "react";
import UserContext from "./Main/SubMains/UserContext.js";


function App() {

  const [ActiveContent,SetActiveContent] = useState(true);
  const [user, setUser] = useState(false);
  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="appWide">
        <Header/>
        <NavBar ActiveContent={ActiveContent} SetActiveContent={SetActiveContent}/>
        <Main ActiveContent={ActiveContent}/>
      </div>
    </UserContext.Provider>
  );
}

export default App;
