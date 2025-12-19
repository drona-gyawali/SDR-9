import { Routes, Route } from "react-router-dom"
import Receiver from "./page/Receiver"
import { Sender } from "./page/Sender"

export default function App() {
  return (
    <Routes>
      <Route path="/receiver/:roomId" element={<Receiver />} />
      <Route path="/" element={<Sender />} />
    </Routes>
  )
}
