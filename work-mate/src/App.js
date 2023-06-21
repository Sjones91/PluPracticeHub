import "./Reset.css";
import './App.css';
import "./Main/Main.css"
import Main from  "./Main/Main.js";
import Header from "./Header/Header.js";
import NavBar from "./Nav Bar/Navbar.js";
import Contact from "./Main/Contact.js";
import PrivacyPolicy from "./Main/PrivacyPolicy.js"
import React, { useState,createContext} from "react";
//import routes

export const UserContext =createContext();
function App() {
  //global use states.
  const [ActiveContent,SetActiveContent] = useState(true);
  const [user, setUser] = useState(false);
  const [storeNum,setStoreNum] = useState("");
  const [adminValid,setAdminValid] = useState(true);
  const [ip,setIp] =useState("209.141.50.150"); //server = 209.141.50.150
  const [protocol, setProtocol] = useState("http://");
  //page switch status for main, contact and privacy policy.
  const [mainContent,setMainContent] = useState(0);
  let content;
  switch (mainContent) {
    case 1:
      content = <Contact setMainContent = {setMainContent}/>;
      break;

    default:
      content = (
        <UserContext.Provider value={[user, setUser, adminValid, setAdminValid, ip, protocol, setStoreNum, storeNum]}>
          <div className="appWide">
            <Header />
            <NavBar ActiveContent={ActiveContent} SetActiveContent={SetActiveContent} />
            <Main ActiveContent={ActiveContent} />
          </div>
          {/* <section className="footer">
            <ul className="footerList">
              <li onClick={() => setMainContent(0)}>Home</li>
              <li onClick={() => setMainContent(1)}>Contact</li>
              <li onClick={() => setMainContent(2)}>Privacy Policy</li>
            </ul>
          </section> */}
        </UserContext.Provider>
      );
      break;
  }

  return (
    <div className="d-f-col">
      {content}
      
    </div>
  );
}

export default App;
