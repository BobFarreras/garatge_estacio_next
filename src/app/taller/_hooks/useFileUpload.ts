import { useState, useEffect } from 'react';
import { APPOINTMENT_CONFIG } from '@/config/taller'; // MODIFICAT

// MODIFICAT: Eliminem l'argument 'options' perquè el valor ve directament de la configuració.
export function useFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    // MODIFICAT: Usem el valor del fitxer de configuració.
    const updatedFiles = [...files, ...newFiles].slice(0, APPOINTMENT_CONFIG.MAX_FILES);
    setFiles(updatedFiles);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files => files.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    // Aquesta part de la lògica ja era correcta.
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
      return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    } else {
      setImagePreviews([]);
    }
  }, [files]);

  return { files, imagePreviews, handleFileChange, removeFile };
}