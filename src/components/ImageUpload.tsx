import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  onRemove?: () => void;
  currentImage?: string;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  label = 'Upload Image',
  maxSizeMB = 1,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Compression options
      const options = {
        maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      };

      // Compress image
      const compressedFile = await imageCompression(file, options);

      // Check if still over limit after compression
      if (compressedFile.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Image is still too large after compression. Please use an image under ${maxSizeMB}MB.`);
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);

      // Call onUpload with compressed file
      onUpload(compressedFile);
    } catch (err: any) {
      setError(err.message || 'Error processing image');
      console.error('Image upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Call onRemove callback if provided
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-300">{label}</label>
      
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-2xl border border-neutral-800"
          />
          {/* Hover overlay for changing image */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-2xl"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-medium">Change Image</p>
            </div>
          </div>
          {/* Remove button */}
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-neutral-900/90 rounded-full hover:bg-red-500 transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
          {/* Hidden file input for changing */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-800 rounded-2xl p-8 text-center cursor-pointer hover:border-lime-primary/50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-primary" />
              <p className="text-sm text-neutral-400">Compressing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-neutral-900 rounded-full">
                <Upload className="w-8 h-8 text-lime-primary" />
              </div>
              <div>
                <p className="text-neutral-300 font-medium">Click to upload</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Max size: {maxSizeMB}MB (auto-compressed)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
