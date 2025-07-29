import React, { useRef, useState } from "react";

type Props = {
  label?: string;
  images: File[];
  setImages: (files: File[]) => void;
};

const ImageUpload: React.FC<Props> = ({ label = "Fotos", images, setImages }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      setPreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type="file"
        className="form-control"
        multiple
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
      />
      <div className="d-flex flex-wrap mt-2 gap-2">
        {previews.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="Prévia"
            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
