import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider
import { store } from './Store'; // Import your Redux store
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
    <BrowserRouter basename="/rider-coffee-roaster">
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
);
