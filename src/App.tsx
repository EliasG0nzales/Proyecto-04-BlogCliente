import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Contact from "./pages/Contact";
import Payment from "./pages/Payment";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Contact />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}
