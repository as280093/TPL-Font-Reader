import React from 'react';
import { hexToText } from './hexUtils';

export const formatFontName = (fontName: string): string => {
  return fontName
    .replace(/-+/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const checkFontAvailability = async (
  fontFamily: string, 
  fontStyle: string = '', 
  fontCache: Record<string, boolean>,
  setFontCache: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
): Promise<boolean> => {
  const cacheKey = `${fontFamily}-${fontStyle}`;
  if (fontCache[cacheKey] !== undefined) {
    return fontCache[cacheKey];
  }

  return new Promise((resolve) => {
    const detector = document.createElement('span');
    detector.style.visibility = 'hidden';
    detector.style.position = 'absolute';
    detector.style.fontSize = '72px';
    detector.style.fontFamily = '"Comic Sans MS"';
    detector.textContent = 'i am invisible';
    document.body.appendChild(detector);
    
    const defaultWidth = detector.offsetWidth;
    
    try {
      detector.style.fontFamily = `"${fontFamily.trim()}", "Comic Sans MS"`;
      if (fontStyle) {
        detector.style.fontWeight = fontStyle.includes('Bold') ? 'bold' : 'normal';
        detector.style.fontStyle = fontStyle.includes('Italic') ? 'italic' : 'normal';
      }
      
      setTimeout(() => {
        const isAvailable = defaultWidth !== detector.offsetWidth;
        setFontCache(prev => ({...prev, [cacheKey]: isAvailable}));
        document.body.removeChild(detector);
        resolve(isAvailable);
      }, 300);
    } catch (error) {
      document.body.removeChild(detector);
      setFontCache(prev => ({...prev, [cacheKey]: false}));
      resolve(false);
    }
  });
};

export const extractFontContent = (hexData: string): string[] => {
  const startPatternHex = '666f6e74506f73745363726970744e616d6554455854';
  const fntNTEXTHex = '466e744e54455854';
  const fntSTEXTHex = '466e745354455854';
  
  const fonts = new Set<string>();
  let startIndex = 0;
  
  while ((startIndex = hexData.indexOf(startPatternHex, startIndex)) !== -1) {
    const fntNTEXTIndex = hexData.indexOf(fntNTEXTHex, startIndex);
    if (fntNTEXTIndex === -1) break;
    
    const fntSTEXTIndex = hexData.indexOf(fntSTEXTHex, fntNTEXTIndex);
    if (fntSTEXTIndex === -1) break;
    
    const fontFamilyHex = hexData.slice(fntNTEXTIndex + fntNTEXTHex.length, fntSTEXTIndex);
    const fontStyleHex = hexData.slice(fntSTEXTIndex + fntSTEXTHex.length, fntSTEXTIndex + 100);

    const fontFamily = hexToText(fontFamilyHex).trim();
    const fontStyle = hexToText(fontStyleHex).split('Scrplong')[0].trim();

    if (fontFamily && fontFamily !== 'Myriad Pro') {
      fonts.add(JSON.stringify({
        combined: fontStyle ? `${fontFamily}-${fontStyle}` : fontFamily,
        family: fontFamily,
        style: fontStyle
      }));
    }
    
    startIndex = fntSTEXTIndex + fntSTEXTHex.length;
  }
  
  return Array.from(fonts);
}; 