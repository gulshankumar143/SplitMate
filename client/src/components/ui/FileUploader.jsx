import { useState } from 'react';

const FileUploader = ({ label, onUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    await onUpload(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-200">{label}</label>
      <div className="flex items-center gap-4 rounded-3xl border border-slate-700 bg-slate-900/90 p-4">
        <input type="file" accept="image/*,application/pdf" onChange={handleChange} className="text-slate-200" />
      </div>
      {preview && <img src={preview} alt="preview" className="h-44 w-full rounded-3xl object-cover" />}
    </div>
  );
};

export default FileUploader;
