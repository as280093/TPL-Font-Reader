import React, { useState } from 'react';
import FontTable from './components/FontTable/FontTable';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './App.css';
import { formatFontName, checkFontAvailability, extractFontContent } from './utils/fontUtils';

const App: React.FC = () => {
  const [fileName, setFileName] = useState<string>('No file selected');
  const [formattedFonts, setFormattedFonts] = useState<Array<{
    original: string;
    formatted: string;
    family: string;
    style: string;
    isInstalled: boolean;
    presetName: string;
  }>>([]);
  const [notification, setNotification] = useState<string>('');
  const [fontCache, setFontCache] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hexLookup = new Array(256).fill('').map((_, i) => i.toString(16).padStart(2, '0'));

  const convertToHex = React.useCallback((binaryData: string): string => {
    const len = binaryData.length;
    const result = new Array(len);
    
    for (let i = 0; i < len; i++) {
      result[i] = hexLookup[binaryData.charCodeAt(i)];
    }
    
    return result.join('');
  }, [hexLookup]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.tpl')) {
      setFormattedFonts([]);
      setFileName(file.name);
      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        const binaryData = Array.from(new Uint8Array(buffer))
          .map(byte => String.fromCharCode(byte))
          .join('');
        const hexData = convertToHex(binaryData);
        const extractedFonts = extractFontContent(hexData);
        
        const validFonts = extractedFonts
          .map(fontJson => JSON.parse(fontJson))
          .filter(font => font.combined !== 'Myriad Pro-Regular');

        if (validFonts.length === 0) {
          setFormattedFonts([]);
          showNotification('No valid fonts found in this TPL file');
          return;
        }

        const processed = await Promise.all(validFonts.map(async font => {
          const isInstalled = await checkFontAvailability(
            font.family,
            font.style,
            fontCache,
            setFontCache
          );
          console.log(`Font check result for ${font.combined}: ${isInstalled}`);
          return {
            original: font.combined,
            formatted: formatFontName(font.combined),
            family: font.family,
            style: font.style,
            presetName: font.presetName,
            isInstalled
          };
        }));
        
        setFormattedFonts(processed);
        setIsLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please select a valid .tpl file');
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <div className="app" data-theme="dark">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      <Navbar />
      <main>
        <header className="header">
          <h1>TPL Font Reader (Beta)</h1>
          <div>
            <label className="upload-button">
              <input type="file" accept=".tpl" onChange={handleFileUpload} />
              Open File
            </label>
            <span className="file-name">
              {fileName} {isLoading && '(Loading...)'}
            </span>
          </div>
        </header>
        {formattedFonts.length > 0 ? (
          <FontTable 
            fonts={formattedFonts} 
            onNotification={showNotification}
          />
        ) : (
          <div className="empty-state">
            <p>
              {fileName !== 'No file selected' ? (
                <>
                  <span className="error-icon">⚠️</span>
                  <br />
                  No valid font names found in this file.
                  <br />
                  Please try another TPL file.
                </>
              ) : (
                'No fonts to display. Upload a .tpl file to get started.'
              )}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
