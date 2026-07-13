import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CarSelection from "./pages/CarSelection";
import CharacterList from "./pages/CharacterList";
import Landing from "./pages/Landing";
import TimewalkingGearSelection from "./pages/TimewalkingGearSelection";
import { ROUTES } from "./constants/routes";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.CAR_SELECTION} element={<CarSelection />} />
        <Route path={ROUTES.TIMEWALKING} element={<Navigate to={ROUTES.TIMEWALKING_CHARACTERS} replace />} />
        <Route path={ROUTES.TIMEWALKING_CHARACTERS} element={<CharacterList />} />
        <Route path={ROUTES.TIMEWALKING_GEAR} element={<TimewalkingGearSelection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
