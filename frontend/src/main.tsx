import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { Buffer } from "buffer";
import process from "process";

window.Buffer = Buffer;
window.process = process;


createRoot(document.getElementById('root')!).render(

    <Router>
        <App />
    </Router>
)
