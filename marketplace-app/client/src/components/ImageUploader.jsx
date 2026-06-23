import { useRef, useState } from 'react';
import { uploadImageToCloudinary } from '../api/cloudinary.js';

const ImageUploader = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImageToCloudinary(file)));
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.message || 'Could not upload image');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-xs font-mono uppercase text-ink/60 mb-2">Photos</label>
      <div className="flex flex-wrap gap-3 mb-2">
        {images.map((url, index) => (
          <div
            key={url + index}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-sage-100 group"
          >
            <img src={url} alt={`Listing photo ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 text-paper text-xs leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-xl border-2 border-dashed border-sage-100 flex flex-col items-center justify-center text-ink/40 hover:border-sage-400 hover:text-sage-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-[11px] font-mono">Uploading...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              <span className="text-[11px] font-mono mt-1">Add photo</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
      <p className="text-xs text-ink/40">You can add multiple photos. The first one becomes the cover image.</p>
      {error && <p className="text-sm text-clay mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;