import { TenantProvider } from './lib/tenant';
import { LandingPage } from './components/pages/LandingPage';

function App() {
  return (
    <TenantProvider>
      <LandingPage />
    </TenantProvider>
  );
}

export default App;
