import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../layout/BaseLayout';
import ForecastPage from '../pages/ForecastPage';
import AlertsPage from '../pages/AlertsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      { index: true, element: <ForecastPage /> },
      { path: 'alerts', element: <AlertsPage /> },
    ],
  },
]);

export default router;
