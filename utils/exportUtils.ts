
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { GeneratedData } from '../types';

const formatDate = (ts: number) => new Date(ts).toISOString().replace(/[:.]/g, '-');

export const downloadImage = (url: string, filename: string) => {
  saveAs(url, filename);
};

export const downloadText = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
};

export const createMetadata = (item: GeneratedData) => {
  return JSON.stringify({
    generationId: item.id,
    timestamp: new Date(item.timestamp).toISOString(),
    character: item.character,
    action: item.action,
    background: item.background,
    colorScheme: item.colorScheme,
    effects: item.effects,
    rarityTier: item.rarity,
    ethValue: item.ethValue,
    imagePrompt: item.imagePrompt,
    videoPrompt: item.videoPrompt
  }, null, 2);
};

export const downloadPackage = async (item: GeneratedData, onProgress?: (percent: number) => void) => {
  const zip = new JSZip();
  // New Naming Convention
  const downloadName = `Olly AI NFTs-${item.id}`;
  const internalPrefix = `Olly-NFT-${item.id}`;

  // Add Metadata
  zip.file(`${internalPrefix}-metadata.json`, createMetadata(item));
  
  // Add Prompts
  zip.file(`${internalPrefix}-image-prompt.txt`, item.imagePrompt);
  zip.file(`${internalPrefix}-video-prompt.txt`, item.videoPrompt);

  // Add Image
  if (item.imageUrl) {
    try {
      if (onProgress) onProgress(10);
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      zip.file(`${internalPrefix}-image.png`, blob);
      if (onProgress) onProgress(50);
    } catch (e) {
      console.error("Failed to fetch image for zip", e);
    }
  }

  const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
    if (onProgress) onProgress(50 + (metadata.percent / 2));
  });
  
  if (onProgress) onProgress(100);
  saveAs(content, `${downloadName}.zip`);
};

export const downloadBulk = async (items: GeneratedData[], zipName: string, onProgress?: (percent: number) => void) => {
  const zip = new JSZip();
  const totalItems = items.length;
  let processedItems = 0;
  
  for (const item of items) {
    const folder = zip.folder(`Olly-NFT-${item.id}`);
    if (folder) {
      folder.file(`metadata.json`, createMetadata(item));
      folder.file(`image-prompt.txt`, item.imagePrompt);
      folder.file(`video-prompt.txt`, item.videoPrompt);
      
      if (item.imageUrl) {
        try {
          // Fetching base64/blob images
          const response = await fetch(item.imageUrl);
          const blob = await response.blob();
          folder.file(`image.png`, blob);
        } catch (e) {
          console.warn(`Failed to include image for ${item.id}`, e);
        }
      }
    }
    processedItems++;
    if (onProgress) onProgress((processedItems / totalItems) * 80); // Fetching is 80% of work
  }

  const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
    if (onProgress) onProgress(80 + (metadata.percent * 0.2)); // Zipping is 20%
  });
  
  if (onProgress) onProgress(100);
  saveAs(content, `${zipName}.zip`);
};
