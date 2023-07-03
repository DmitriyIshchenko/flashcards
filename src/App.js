import Carousel from "./Carousel";
import "./index.scss";

const data = [
  { term: "term 1", description: "description 1" },
  { term: "term 2", description: "description 2" },
  { term: "term 3", description: "description 3" },
  { term: "term 4", description: "description 4" },
  { term: "term 5", description: "description 5" },
];

export default function App() {
  return (
    <div className="App">
      <Carousel>
        <p>Item 1</p>
        <p>Item 2</p>
        <p>Item 3</p>
      </Carousel>
    </div>
  );
}
