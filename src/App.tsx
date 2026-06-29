import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CarSelection from "./pages/CarSelection";
import CharacterList from "./pages/CharacterList";
import Landing from "./pages/Landing";
import TimewalkingGearSelection from "./pages/TimewalkingGearSelection";
import { CarSelectionProvider } from "./services/CarSelectionService";
import { ROUTES } from "./constants/routes";
// import Sidebar from "./components/car/Sidebar";

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
                <Route path={ROUTES.HOME} element={<Landing />} />
                <Route path={ROUTES.CAR_SELECTION} element={<CarSelection />} />
                <Route path={ROUTES.TIMEWALKING} element={<Navigate to={ROUTES.TIMEWALKING_CHARACTERS} replace />} />
                <Route path={ROUTES.TIMEWALKING_CHARACTERS} element={<CharacterList />} />
                <Route path={ROUTES.TIMEWALKING_GEAR} element={<TimewalkingGearSelection />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </CarSelectionProvider>
    </>
  );
}

export default App;
