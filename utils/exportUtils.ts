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

export const downloadPackage = async (item: GeneratedData) => {
  const zip = new JSZip();
  const baseName = `nft-${item.id}`;

  // Add Metadata
  zip.file(`${baseName}-metadata.json`, createMetadata(item));
  
  // Add Prompts
  zip.file(`${baseName}-image-prompt.txt`, item.imagePrompt);
  zip.file(`${baseName}-video-prompt.txt`, item.videoPrompt);

  // Add Image
  if (item.imageUrl) {
    try {
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      zip.file(`${baseName}-image.png`, blob);
    } catch (e) {
      console.error("Failed to fetch image for zip", e);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${baseName}-package.zip`);
};

export const downloadBulk = async (items: GeneratedData[], zipName: string) => {
  const zip = new JSZip();
  
  for (const item of items) {
    const folder = zip.folder(`nft-${item.id}`);
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
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${zipName}.zip`);
};