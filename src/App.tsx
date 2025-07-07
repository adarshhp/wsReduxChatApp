import './App.css';
import "tailwindcss";
import Routers from '../Routers/Router'; // Make sure the file name matches your folder structure

function App() {
  return (
    <div className='w-[100vw] h-full min-h-[100vh] bg-gray-300'>
      <Routers />
    </div>
  );
}

export default App;
