export const detectFont = async (
  family: string,
  style: string,
  testString = '0123456789AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ'
): Promise<{ isInstalled: boolean }> => {
  return new Promise((resolve) => {
    const detector = document.createElement('span');
    detector.style.visibility = 'hidden';
    detector.style.position = 'absolute';
    detector.style.fontSize = '72px';
    detector.style.fontFamily = 'monospace';
    detector.textContent = testString;
    document.body.appendChild(detector);
    
    const baseWidth = detector.offsetWidth;
    
    try {
      
      let fontStyle = 'normal';
      let fontWeight = 'normal';
      
      if (style) {
        if (style.includes('Italic')) fontStyle = 'italic';
        if (style.includes('Bold')) fontWeight = 'bold';
        if (style.includes('Light')) fontWeight = '300';
        if (style.includes('Medium')) fontWeight = '500';
      }
      
      detector.style.fontFamily = `"${family.trim()}", monospace`;
      detector.style.fontStyle = fontStyle;
      detector.style.fontWeight = fontWeight;
      
      
      setTimeout(() => {
        const testWidth = detector.offsetWidth;
        const isInstalled = Math.abs(testWidth - baseWidth) > 2;
        
        document.body.removeChild(detector);
        resolve({ isInstalled });
      }, 100);
      
    } catch (error) {
      document.body.removeChild(detector);
      resolve({ isInstalled: false });
    }
  });
};