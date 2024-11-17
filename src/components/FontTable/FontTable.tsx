import React from 'react';
import { FaSearch, FaCheck, FaTimes, FaCopy } from 'react-icons/fa';
import './FontTable.css';
import { checkFontAvailability } from '../../utils/fontUtils';

interface FontTableProps {
  fonts: Array<{
    original: string;
    formatted: string;
    family: string;
    style: string;
    isInstalled: boolean;
  }>;
  onNotification: (message: string) => void;
}

const FontTable: React.FC<FontTableProps> = ({ fonts, onNotification }) => {
  const [fontCache, setFontCache] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const checkFonts = async () => {
      for (const font of fonts) {
        await checkFontAvailability(
          font.family,
          font.style,
          fontCache,
          setFontCache
        );
      }
    };
    
    checkFonts();
  }, [fonts]);

  const handleCopyFont = async (fontName: string) => {
    try {
      await navigator.clipboard.writeText(fontName);
      onNotification(`Copied: ${fontName}`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyMissingFonts = async () => {
    try {
      const missingFonts = fonts
        .filter(font => !font.isInstalled)
        .map(font => font.original);

      const fileName = document.querySelector('.file-name')?.textContent || 'Unknown file';
      
      const content = `${fileName}\nMissing Fonts:\n=============\n${missingFonts.join('\n')}`;
      
      await navigator.clipboard.writeText(content);
      onNotification('Copied missing fonts list to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
      onNotification('Failed to copy missing fonts');
    }
  };

  // Process duplicates
  const processedFonts = fonts.reduce((acc, font) => {
    const existing = acc.find(f => f.original === font.original);
    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      acc.push({ ...font, count: 1 });
    }
    return acc;
  }, [] as Array<typeof fonts[0] & { count?: number }>);

  if (!fonts || fonts.length === 0) {
    return null;
  }

  const missingFontsCount = processedFonts.filter(font => !font.isInstalled).length;

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="missing-count">
          Missing Fonts: <span>{missingFontsCount}</span>
        </div>
        <button 
          className={`copy-button ${missingFontsCount === 0 ? 'disabled' : ''}`}
          onClick={handleCopyMissingFonts}
          disabled={missingFontsCount === 0}
        >
          <FaCopy /> Copy Missing Fonts
        </button>
      </div>
      
      <table className="font-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Font Name</th>
            <th>Status</th>
            <th>Duplicates</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {processedFonts.map((font, index) => (
            <tr key={`${font.original}-${index}`}>
              <td>{index + 1}</td>
              <td>
                <div className="font-cell">
                  <span 
                    className="font-name"
                    onClick={() => handleCopyFont(font.original)}
                  >
                    {font.formatted}
                  </span>
                </div>
              </td>
              <td>
                <span className={font.isInstalled ? 'installed-badge' : 'missing-badge'}>
                  {font.isInstalled ? (
                    <><FaCheck className="badge-icon" /> Installed</>
                  ) : (
                    <><FaTimes className="badge-icon" /> Missing</>
                  )}
                </span>
              </td>
              <td>
                {font.count && font.count > 1 ? (
                  <span className="duplicate-badge">
                    × {font.count}
                  </span>
                ) : null}
              </td>
              <td>
                <button
                  className="search-button"
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(font.original)}+font`, '_blank')}
                >
                  <FaSearch /> Google Search
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FontTable;
