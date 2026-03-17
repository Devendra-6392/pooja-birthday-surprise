import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import IntroScreen from './pages/IntroScreen';
import Page1Welcome from './pages/Page1Welcome';
import Page2Interactions from './pages/Page2Interactions';
import Page3Gifts from './pages/Page3Gifts';
import FinalScreen from './pages/FinalScreen';
import MusicPlayer from './components/MusicPlayer';
import SplashCursor from './components/SplashCursor';




type PageType = 'intro' | 'page1' | 'page2' | 'page3' | 'final';

const NAME = 'Pooja';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('intro');

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleRestart = () => {
    setCurrentPage('page1');
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <SplashCursor />
          <MusicPlayer />
<SplashCursor />
          {/* Page Router */}
          {currentPage === 'intro' && (
            <IntroScreen
              name={NAME}
              onComplete={() => handlePageChange('page1')}
            />
          )}

          {currentPage === 'page1' && (
            <Page1Welcome
              name={NAME}
              onNext={() => handlePageChange('page2')}
            />
          )}

          {currentPage === 'page2' && (
            <Page2Interactions
              name={NAME}
              onNext={() => handlePageChange('page3')}
            />
          )}

          {currentPage === 'page3' && (
            <Page3Gifts
              name={NAME}
              onNext={() => handlePageChange('final')}
            />
          )}

          {currentPage === 'final' && (
            <FinalScreen name={NAME} onRestart={handleRestart} />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
