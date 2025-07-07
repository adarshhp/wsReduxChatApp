import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatApp from '../components/ChatApp/ChatApp';
import "tailwindcss";

// Example of other components you might want to add routing for
// import ReduxTry from '../components/ReduxTry';
// import ReducerTry from '../components/ReducerTry';
// import From from '../components/UseContextTrying/From';
// import ZustandTry from '../components/Zustand/ZustandTry';
// import Task1 from '../components/useReducer/Task1';
// import ReactHook from '../components/HookForm/ReackHook';
// import Customook1 from '../components/CustomHooks/Customook1';
// import SecureL from '../components/LocalStorage/SecureL';
// import Crypto from '../components/LocalStorage/Crypto';
// import MouseTrack from '../components/MouseTracker/MouseTrack';
// import Collapse from '../components/Collapsible/Collapse';
// import Movingplus from '../components/Mouseevent/Movingplus';
import LoginInterface from '../components/ChatApp/LoginInterface'
import Groups from '../components/ChatApp/Groups';
import MyGroups from '../components/ChatApp/MyGroups';
import XOgame from '../components/ChatApp/XOgame';
import Trial from '../components/ChatApp/Trial';
import FortessGame from '../components/ChatApp/FortessGame';
import TrialChecks from '../components/ChatApp/TrialChecks';


function Routers() {
  return (
    <Router>
      <div className="w-[100vw] h-full bg-gray-300">
        <Routes>
          {/* Define routes for each component */}
          <Route path="/" element={<LoginInterface />} />

          <Route path="/chatpage/:id" element={<ChatApp />} />
          <Route path="/trial" element={<Trial/>}/>
          <Route path="/grouppage" element={<Groups/>}/>
          <Route path="/mygroups" element={<MyGroups/>}/>
          <Route path="/xogame" element={<XOgame/>}/> 
          <Route path="/fortess" element={<FortessGame/>}/>
          <Route path="/trialcheck" element={<TrialChecks/>}/>
          {/* Example of other routes */}
          {/* <Route path="/redux" element={<ReduxTry />} />
          <Route path="/reducer" element={<ReducerTry />} />
          <Route path="/form" element={<From />} />
          <Route path="/zustand" element={<ZustandTry />} />
          <Route path="/task1" element={<Task1 />} />
          <Route path="/react-hook" element={<ReactHook />} />
          <Route path="/custom-hook" element={<Customook1 />} />
          <Route path="/secure" element={<SecureL />} />
          <Route path="/crypto" element={<Crypto />} />
          <Route path="/mouse-track" element={<MouseTrack />} />
          <Route path="/collapse" element={<Collapse />} />
          <Route path="/movingplus" element={<Movingplus />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default Routers;
