import { createRoot } from 'react-dom/client';
import '@/assets/sass/main.scss';
import App from './App';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://b27e4c989d815ac033fb90abc12f1a1c@o4511423569068032.ingest.de.sentry.io/4511423573327952',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [Sentry.browserTracingIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Enable logs to be sent to Sentry
  enableLogs: true,
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
