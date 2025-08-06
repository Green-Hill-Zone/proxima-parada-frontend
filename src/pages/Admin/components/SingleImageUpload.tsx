import React, { useRef, useState } from "react";

type Props = {
  label?: string;
  image: File | null;
  setImage: (file: File | null) => void;
};

const SingleImageUpload: React.FC<Props> = ({ label = "Foto", image, setImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setImage(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type="file"
        className="form-control"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
      />

      {preview && (
        <div className="mt-2">
          <div className="position-relative" style={{ display: 'inline-block' }}>
            <img
              src={preview}
              alt="Prévia"
              style={{
                width: 150,
                height: 150,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #ccc"
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-danger position-absolute"
              style={{ top: 5, right: 5 }}
              onClick={handleRemove}
            >
              &times;
            </button>
          </div>
          <div className="text-muted mt-1">
            {image ? `${image.name} (${(image.size / 1024).toFixed(1)} KB)` : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleImageUpload;
