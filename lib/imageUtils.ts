/**
 * Converts standard Google Drive sharing links to direct embeddable CDN links.
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  // If it's a base64 data URI, return as-is
  if (trimmed.startsWith("data:image/")) return trimmed;

  // Match Google Drive file ID
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  return trimmed;
}

/**
 * Resizes an uploaded image client-side to maximum dimensions and returns an optimized WebP data URL.
 */
export function compressImageFile(file: File, maxWidth = 800, maxHeight = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please upload a valid image file."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const dataUri = readerEvent.target?.result as string;
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUri);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first, fallback to jpeg (quality 0.72 produces high-clarity yet lightweight ~40KB data URI)
        try {
          const webpData = canvas.toDataURL("image/webp", 0.72);
          if (webpData.startsWith("data:image/webp")) {
            resolve(webpData);
            return;
          }
        } catch {
          // ignore
        }

        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };

      img.onerror = () => resolve(dataUri);
      img.src = dataUri;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
