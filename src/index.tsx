import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider
import store from './Store'; // Import your Redux store
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}> {/* Wrap your App with the Provider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
