import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div>
      <h1>Homepage</h1>
      <Link to="/app">Go to app</Link>
    </div>
  );
}

export default Homepage;
