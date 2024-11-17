export const hexToText = (hex: string): string => {
    return hex
      .match(/.{2}/g)
      ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join('')
      .replace(/[^\x20-\x7E]+/g, '') || '';
  };
  
  export const createHexLookup = () => {
    return new Array(256).fill('').map((_, i) => i.toString(16).padStart(2, '0'));
  };
  
  export const convertToHex = (binaryData: string, hexLookup: string[]): string => {
    const len = binaryData.length;
    const result = new Array(len);
    
    for (let i = 0; i < len; i++) {
      result[i] = hexLookup[binaryData.charCodeAt(i)];
    }
    
    return result.join('');
  }; 