import "./App.css";
import CarSelection from "./pages/CarSelection";
import { CarSelectionProvider } from "./services/CarSelectionService";

function App() {
  return (
    <>
      <CarSelectionProvider>
        <CarSelection/>
      </CarSelectionProvider>
    </>
  );
}

export default App;
