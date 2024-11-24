import React from 'react';
import { hexToText } from './hexUtils';

interface FontData {
  combined: string;
  family: string;
  style: string;
  presetName: string;
}

export const formatFontName = (fontName: string): string => {
  return fontName
    .replace(/-+/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const extractPresetName = (hexData: string): string[] => {
  console.log('Starting preset name extraction...');
  
  const patterns = {
    start: '00000000001000000001000000000014747970654372656174654f724564697454',
    marker: '000000'
  };
  
  const names: string[] = [];
  let startIndex = 0;



  while ((startIndex = hexData.indexOf(patterns.start, startIndex)) !== -1) {

    let markerIndex = startIndex - 6;
    while (markerIndex >= 0) {
      const currentMarker = hexData.slice(markerIndex, markerIndex + 6);
      if (currentMarker === patterns.marker) {

        const nameHex = hexData.slice(markerIndex + 6, startIndex);
        const name = hexToText(nameHex).trim();
        if (name) {
          names.push(name);
        }
        break;
      }
      markerIndex -= 2;
    }

    startIndex += patterns.start.length;
  }

  return names.length > 0 ? names : ['Untitled Preset'];
};

export const extractFontContent = (hexData: string): string[] => {
  const presetNames = extractPresetName(hexData);
  const patterns = {
    start: '666f6e74506f73745363726970744e616d6554455854',
    fntNTEXT: '466e744e54455854',
    fntSTEXT: '466e745354455854'
  };

  const fonts = new Set<string>();
  let startIndex = 0;
  let currentPresetIndex = 0;
  let lastFontPosition = -1;

  const extractFont = (index: number): { nextIndex: number; font?: FontData } => {
    const fntNTEXTIndex = hexData.indexOf(patterns.fntNTEXT, index);
    if (fntNTEXTIndex === -1) return { nextIndex: -1 };

    const fntSTEXTIndex = hexData.indexOf(patterns.fntSTEXT, fntNTEXTIndex);
    if (fntSTEXTIndex === -1) return { nextIndex: -1 };

    const fontFamily = hexToText(hexData.slice(
      fntNTEXTIndex + patterns.fntNTEXT.length, 
      fntSTEXTIndex
    )).trim();

    const fontStyle = hexToText(hexData.slice(
      fntSTEXTIndex + patterns.fntSTEXT.length, 
      fntSTEXTIndex + 100
    )).split('Scrplong')[0].trim();

    return {
      nextIndex: fntSTEXTIndex + patterns.fntSTEXT.length,
      font: fontFamily && fontFamily !== 'Myriad Pro' ? {
        combined: fontStyle ? `${fontFamily}-${fontStyle}` : fontFamily,
        family: fontFamily,
        style: fontStyle,
        presetName: presetNames[currentPresetIndex]
      } : undefined
    };
  };

  while ((startIndex = hexData.indexOf(patterns.start, startIndex)) !== -1) {
    if (lastFontPosition !== -1 && startIndex - lastFontPosition > 5000) {
      currentPresetIndex = Math.min(currentPresetIndex + 1, presetNames.length - 1);
    }

    const { nextIndex, font } = extractFont(startIndex);
    if (nextIndex === -1) break;
    
    if (font) fonts.add(JSON.stringify(font));
    lastFontPosition = startIndex;
    startIndex = nextIndex;
  }

  return Array.from(fonts);
};

export const checkFontAvailability = async (
  family: string,
  style: string,
  cache: Record<string, boolean>,
  setCache: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
): Promise<boolean> => {
  const fontKey = `${family}-${style}`;
  if (cache[fontKey] !== undefined) return cache[fontKey];

  try {
    const { detectFont } = await import('./dynamic/fontDetection');
    
    const results = await Promise.all([
      detectFont(family, style),
      detectFont(family, style),
      detectFont(family, style)
    ]);
    
    const isAvailable = results.every(result => result.isInstalled === true);
    console.log(`Font check: ${family}-${style} => ${isAvailable} (${results.map(r => r.isInstalled)})`);
    
    setCache(prev => ({...prev, [fontKey]: isAvailable}));
    return isAvailable;
    
  } catch (error) {
    console.warn('Font availability check failed:', error);
    return false;
  }
};

