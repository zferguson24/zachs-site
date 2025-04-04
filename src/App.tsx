import "./App.css";
import Card from "./components/Card";
import Heading from "./components/Heading";
import NumberLine from "./components/NumerLine";

function App() {
  return (
    <>
      <Card>
        <Heading title="Attribute Selection"></Heading>
        <NumberLine digits={6} leftLabel="Slow" rightLabel="Fast" />
        <NumberLine digits={6} leftLabel="Economical" rightLabel="Fun" />
        <NumberLine digits={6} leftLabel="Small" rightLabel="Large" />
        <NumberLine digits={6} leftLabel="Relaxed" rightLabel="Lively" />
      </Card>
    </>
  );
}

export default App;
