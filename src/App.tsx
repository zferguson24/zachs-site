import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CarSelection from "./pages/CarSelection";
import CharacterList from "./pages/CharacterList";
import Landing from "./pages/Landing";
import TimewalkingGearSelection from "./pages/TimewalkingGearSelection";
import { CarSelectionProvider } from "./services/CarSelectionService";
// import Sidebar from "./components/Sidebar";

// const menuItems = [{ name: "Car Selection", path: "/", icon: "🚗" }];

function App() {
  return (
    <>
      <CarSelectionProvider>
        <BrowserRouter basename="/">
          <div style={{ display: "flex" }}>
            {/* <Sidebar items={menuItems} /> */}
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/car-selection" element={<CarSelection />} />
                <Route path="/timewalking" element={<Navigate to="/timewalking/characters" replace />} />
                <Route path="/timewalking/characters" element={<CharacterList />} />
                <Route path="/timewalking/gear" element={<TimewalkingGearSelection />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </CarSelectionProvider>
    </>
  );
}

export default App;
