import { useState } from 'react';

const PLACEHOLDER = 'https://placehold.co/800x600/EEF2EE/3B5641?text=No+Image';

const ImageGallery = ({ images, title }) => {
  const photos = images && images.length > 0 ? images : [PLACEHOLDER];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="rounded-2xl overflow-hidden bg-sage-50 aspect-[4/3]">
        <img src={photos[active]} alt={title} className="w-full h-full object-cover" />
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {photos.map((url, index) => (
            <button
              key={url + index}
              type="button"
              onClick={() => setActive(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                active === index ? 'border-sage-600' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`${title} photo ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;