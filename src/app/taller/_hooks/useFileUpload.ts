// src/app/taller/_hooks/useFileUpload.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; 
// Assegureu-vos que ACCEPTED_IMAGE_TYPES s'importa de la vostra ubicació real:
import { ACCEPTED_IMAGE_TYPES } from '@/lib/utils/appointmentValidation'; 

// Definició de tipus per a la configuració (simplificada)
interface AppointmentConfig {
    MAX_FILES: number;
    MAX_FILE_SIZE_MB: number;
}

// ✅ El hook rep 't' i 'config'
export function useFileUpload(t: (key: string, options?: any) => string, config: AppointmentConfig) { 
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const MAX_FILES = config.MAX_FILES;
  const MAX_FILE_SIZE_MB = config.MAX_FILE_SIZE_MB;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    
    let validFiles: File[] = [];
    let hasError = false;
    let errorMessage = '';

    
    // 1. Validació de cada nou arxiu individualment
    for (const file of newFiles) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            errorMessage = `L'arxiu "${file.name}" supera el límit de ${MAX_FILE_SIZE_MB}MB.`;
            hasError = true;
            break;
        }
        // Validació de format d'imatge
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            errorMessage = t('validation.invalidFileType', { 
                formats: ACCEPTED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ') 
            });
            hasError = true;
            break;
        }
        
        validFiles.push(file);
    }
    
    // 2. Comprovació del límit total
    const finalFiles = [...files, ...validFiles];

    if (!hasError && finalFiles.length > MAX_FILES) {
        const excess = finalFiles.length - MAX_FILES;
        errorMessage = `No pots pujar més de ${MAX_FILES} arxius en total. S'han omès ${excess} arxiu(s).`;
        hasError = true;
    }
    
    if (hasError) {
        toast.error(t('toast.submitErrorTitle'), {
            description: errorMessage,
        });
        // Si hi ha hagut error de límit o d'un arxiu, actualitzem a la llista màxima vàlida
        setFiles(finalFiles.slice(0, MAX_FILES));
        event.target.value = ''; // Reinicia l'input
    } else {
        // Si tot és vàlid
        setFiles(finalFiles);
        event.target.value = ''; // Reinicia l'input
    }
  };


  const removeFile = (indexToRemove: number) => {
    setFiles(files => files.filter((_, index) => index !== indexToRemove));
  };
  
  const resetFiles = () => {
      setFiles([]);
  }

  // Creació i neteja de previsualitzacions d'imatges
  useEffect(() => {
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
      // Funció de neteja
      return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    } else {
      setImagePreviews([]);
    }
  }, [files]);

  return { files, imagePreviews, handleFileChange, removeFile, resetFiles };
}