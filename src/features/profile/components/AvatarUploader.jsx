import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

const AvatarUploader = ({ currentUrl, onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, we'd upload this file.
      // For now, we simulate an upload by creating a local URL.
      const objectUrl = URL.createObjectURL(file);
      onUpload(objectUrl);
    }
  };

  return (
    <div className="relative group w-24 h-24 sm:w-32 sm:h-32">
      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-gray-200">
        <img
          src={currentUrl || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex items-center justify-center"
        >
          <Camera className="text-white w-8 h-8" />
        </div>
      </div>

      {/* <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors sm:hidden"
        type="button"
      >
        <Camera className="w-4 h-4" />
      </button> */}

      {/* <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      /> */}
    </div>
  );
};

export default AvatarUploader;
