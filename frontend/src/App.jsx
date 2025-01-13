import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from './components/Home';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}