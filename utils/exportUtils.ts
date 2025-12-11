
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { jsPDF } from "jspdf";
import { GeneratedData } from '../types';

const formatDate = (ts: number) => new Date(ts).toISOString().replace(/[:.]/g, '-');

export const downloadImage = (url: string, filename: string) => {
  saveAs(url, filename);
};

export const downloadText = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
};

export const downloadPromptGuidePDF = () => {
  const doc = new jsPDF();
  let cursorY = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  // --- PAGE 1: The Core Protocol ---

  // Header
  doc.setFillColor(10, 10, 10); // Nearly black
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 240, 255); // Neon Cyan
  doc.text("OLLY: THE MASTER BLUEPRINT", margin, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text("v3.0 | Exclusive for Pro Subscribers", margin, 28);

  cursorY = 55;

  // Section 1: The Formula
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("1. The 5-Step Generation Protocol", margin, cursorY);
  
  cursorY += 10;
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("To achieve the signature 'Olly' look (clean, vector, flat), strict adherence to this sequence is required:", margin, cursorY);
  
  cursorY += 10;
  
  const formulaSteps = [
    { name: "SUBJECT", desc: "The focal point. Be specific (e.g., 'Geometric Samurai' vs 'Man')." },
    { name: "ACTION", desc: "Dynamic verb. Avoid static poses. Use 'Sprinting', 'Levitating'." },
    { name: "CONTEXT", desc: "The environment. 'Neon cityscape', 'Abstract void'." },
    { name: "AESTHETIC", desc: "The most critical part. 'Flat design', 'Vector art', 'Zero outlines'." },
    { name: "TECH SPECS", desc: "'8k resolution', 'Behance style', 'Matte finish'." }
  ];

  formulaSteps.forEach(step => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`[${step.name}]`, margin, cursorY);
    
    doc.setFont("helvetica", "normal");
    doc.text(`- ${step.desc}`, margin + 35, cursorY);
    cursorY += 7;
  });

  cursorY += 10;

  // Section 2: The Golden Keywords
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("2. The Golden Keyword Library", margin, cursorY);
  cursorY += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Inject these terms to force specific artistic outcomes:", margin, cursorY);
  cursorY += 8;

  const styles = [
    ["Corporate Memphis", "Exaggerated limbs, joyful, flat colors, big shapes"],
    ["Cyberpunk Vector", "Neon gradients, sharp angles, grid backgrounds"],
    ["Bauhaus", "Primary colors, geometric primitives, minimal"],
    ["Glassmorphism", "Translucent, frosted glass effect, blurred backdrops"],
    ["Paper Cutout", "Layered shadows, depth, craft aesthetic"]
  ];

  styles.forEach(([style, desc]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`• ${style}:`, margin, cursorY);
    const textWidth = doc.getTextWidth(`• ${style}:`);
    doc.setFont("helvetica", "normal");
    doc.text(desc, margin + textWidth + 2, cursorY);
    cursorY += 7;
  });

  cursorY += 10;

  // Section 3: Camera & Lighting (Crucial for 3D/2D hybrid)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("3. Camera & Lighting Modifiers", margin, cursorY);
  cursorY += 10;

  const cameraTips = [
    "• 'Orthographic View': Forces a 3D isometric look without perspective distortion.",
    "• 'Soft Studio Lighting': Removes harsh shadows for a cleaner look.",
    "• 'Rim Lighting': Adds a glowing edge to separate subject from background.",
    "• 'Knolling': Arranges objects at 90-degree angles (great for item sets)."
  ];

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  cameraTips.forEach(tip => {
    doc.text(tip, margin, cursorY);
    cursorY += 7;
  });

  // Footer Page 1
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Page 1 of 2", pageWidth / 2, 285, { align: "center" });

  // --- PAGE 2: Animation & Advanced ---
  doc.addPage();
  cursorY = 20;

  // Section 4: Video Prompting (Meta AI / Veo)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("4. Mastering Video Prompts (Veo/Runway)", margin, cursorY);
  cursorY += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const videoIntro = "To get perfect loops for NFTs, you must describe the MOTION, not just the subject.";
  doc.text(videoIntro, margin, cursorY);
  cursorY += 10;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin, cursorY, contentWidth, 30, 'F');
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  const loopPrompt = "TEMPLATE: \"Animate this in a seamless perfect loop. The [SUBJECT] should [ACTION] gently. The motion should be smooth, fluid, and continuous. No camera cuts. Camera remains static. 5-second duration.\"";
  const splitLoop = doc.splitTextToSize(loopPrompt, contentWidth - 10);
  doc.text(splitLoop, margin + 5, cursorY + 8);
  
  cursorY += 40;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Best Motion Verbs:", margin, cursorY);
  cursorY += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("- 'Undulating': Good for liquids, cloth, or abstract shapes.", margin, cursorY); cursorY += 6;
  doc.text("- 'Levitating/Bobbing': The easiest motion to loop perfectly.", margin, cursorY); cursorY += 6;
  doc.text("- 'Morphing': Changing form entirely (e.g., Circle -> Square).", margin, cursorY); cursorY += 6;
  doc.text("- 'Orbiting': Elements spinning around a central axis.", margin, cursorY); cursorY += 12;

  // Section 5: Negative Prompting
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("5. The 'Kill List' (Negative Prompts)", margin, cursorY);
  cursorY += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Always exclude these to ensure the 'Olly' vector look:", margin, cursorY);
  cursorY += 8;

  doc.setTextColor(200, 0, 0); // Red
  const negativeBlock = "photorealistic, grainy, noise, textured, grunge, messy lines, sketch, blurred, watermark, text, signature, low resolution, jpeg artifacts, 3d render, shadows";
  const splitNeg = doc.splitTextToSize(negativeBlock, contentWidth);
  doc.text(splitNeg, margin, cursorY);
  
  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text("Generated by Olly AI Engine. Do not distribute.", pageWidth / 2, 280, { align: "center" });
  doc.text("Page 2 of 2", pageWidth / 2, 285, { align: "center" });

  doc.save("Olly-Master-Blueprint.pdf");
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
