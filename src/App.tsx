import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CarSelection from "./pages/CarSelection";
import { CarSelectionProvider } from "./services/CarSelectionService";
// import Sidebar from "./components/Sidebar";

// const menuItems = [{ name: "Car Selection", path: "/", icon: "🚗" }];

function App() {
  return (
    <>
      <CarSelectionProvider>
        <BrowserRouter basename="/zachs-site/">
          <div style={{ display: "flex" }}>
            {/* <Sidebar items={menuItems} /> */}
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<CarSelection />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </CarSelectionProvider>
    </>
  );
}

export default App;
