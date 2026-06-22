import { useState, useEffect } from 'react';

export function useProductColors(imageUrl: string, fallbackGradient: string) {
  const [gradient, setGradient] = useState<string>('');

  useEffect(() => {
    const parseTailwindGradient = (tw: string) => {
      const hexes = tw.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g);
      if (hexes && hexes.length >= 2) {
        return `linear-gradient(135deg, ${hexes.map(h => h.startsWith('#') ? h : `#${h}`).join(', ')})`;
      }
      return `linear-gradient(135deg, #0A0510, #201042)`;
    };

    const defaultGradient = parseTailwindGradient(fallbackGradient);
    setGradient(defaultGradient);

    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 30;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 30, 30);
        const imgData = ctx.getImageData(0, 0, 30, 30).data;

        // Simple clustering: collect colors, exclude absolute transparent/black/white
        const colorCounts: { [key: string]: number } = {};
        const hexList: string[] = [];

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i+1];
          const b = imgData[i+2];
          const a = imgData[i+3];

          // Filter out highly transparent pixels
          if (a < 120) continue;

          // Calculate HSV saturation
          const rNorm = r / 255;
          const gNorm = g / 255;
          const bNorm = b / 255;
          const max = Math.max(rNorm, gNorm, bNorm);
          const min = Math.min(rNorm, gNorm, bNorm);
          const delta = max - min;
          const saturation = max === 0 ? 0 : delta / max;

          // Filter out neutrals (ignores silver bows, gray caps, white reflections)
          if (saturation < 0.15) continue;

          // Filter out absolute dark colors
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness < 30) continue;

          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
          if (!hexList.includes(hex)) hexList.push(hex);
        }

        // Sort colors by frequency
        const sortedColors = hexList.sort((a, b) => colorCounts[b] - colorCounts[a]);

        if (sortedColors.length >= 2) {
          // Take the most dominant color
          const primary = sortedColors[0];
          
          // Find a secondary color that is sufficiently different
          let secondary = sortedColors[1] || primary;
          for (let i = 1; i < sortedColors.length; i++) {
            if (colorDistance(primary, sortedColors[i]) > 40) {
              secondary = sortedColors[i];
              break;
            }
          }

          // Create a premium dark/vibrant background gradient
          const darkPrimary = adjustColorBrightness(primary, -65); // Deep background base
          const midAccent = adjustColorBrightness(secondary, -45); // Deep rich middle tone
          const vibrantHighlight = adjustColorBrightness(primary, -15); // Subtle accent glow

          const newGradient = `linear-gradient(135deg, ${darkPrimary}, ${midAccent}, ${vibrantHighlight})`;
          setGradient(newGradient);
        } else if (sortedColors.length === 1) {
          const primary = sortedColors[0];
          const darkPrimary = adjustColorBrightness(primary, -65);
          const vibrantHighlight = adjustColorBrightness(primary, -20);
          setGradient(`linear-gradient(135deg, ${darkPrimary}, #0A0510, ${vibrantHighlight})`);
        }
      } catch (e) {
        console.error('Failed to extract colors from image', e);
      }
    };
  }, [imageUrl, fallbackGradient]);

  return gradient;
}

// Helper: calculate Euclidean distance in RGB space
function colorDistance(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 0;
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper: adjust brightness of hex color (percent is -100 to 100)
function adjustColorBrightness(hex: string, percent: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  let r = rgb.r + (rgb.r * percent) / 100;
  let g = rgb.g + (rgb.g * percent) / 100;
  let b = rgb.b + (rgb.b * percent) / 100;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
}
