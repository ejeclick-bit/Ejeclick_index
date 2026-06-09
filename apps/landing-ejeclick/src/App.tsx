import { LandingPage } from '@/components/pages/LandingPage';
import { useCursorSpotlight } from '@/hooks/useCursorSpotlight';

function App() {
  useCursorSpotlight();

  return (
    <>
      {/* Capa de spotlight que sigue al cursor, solo visible en desktop */}
      <div className="cursor-spotlight" aria-hidden="true" />
      <LandingPage />
    </>
  );
}

export default App;
