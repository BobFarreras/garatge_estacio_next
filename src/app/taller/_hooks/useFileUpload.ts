// useFileUpload (Logic provided by user's snippet, modified for toast on change)
import { useState, useEffect } from 'react';
import { APPOINTMENT_CONFIG } from '@/config/taller';
import { toast } from 'sonner'; 
// Importem ACCEPTED_IMAGE_TYPES des del fitxer de validació
import { ACCEPTED_IMAGE_TYPES } from '@/lib/utils/appointmentValidation'; 

export function useFileUpload(t: (key: string, options?: any) => string) { 
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const MAX_FILES = APPOINTMENT_CONFIG.MAX_FILES;
  const MAX_FILE_SIZE_MB = APPOINTMENT_CONFIG.MAX_FILE_SIZE_MB;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    
    let validFiles: File[] = [];
    let hasError = false;
    let errorMessage = '';

    // Creem la llista de nous arxius ja filtrats per la mida total
    const prospectiveFiles = [...files, ...newFiles];

    // 1. Validació de cada nou arxiu individualment
    for (const file of newFiles) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            errorMessage = `L'arxiu "${file.name}" supera el límit de ${MAX_FILE_SIZE_MB}MB.`;
            hasError = true;
            break;
        }
        // ✅ Validació de format d'imatge
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
        // Si no hi ha errors individuals, però afegir-los supera el límit
        const excess = finalFiles.length - MAX_FILES;
        // El missatge d'error potser és genèric de límit, i només afegim els que caben.
        errorMessage = `No pots pujar més de ${MAX_FILES} arxius en total. S'han omès ${excess} arxiu(s).`;
        hasError = true;
        validFiles = finalFiles.slice(0, MAX_FILES);
    }
    
    if (hasError) {
        // Mostra el toast d'error
        toast.error(t('toast.submitErrorTitle'), {
            description: errorMessage,
        });
        // Si hi ha hagut algun error, actualitzem la llista a la versió màxima vàlida
        setFiles(finalFiles.slice(0, MAX_FILES));
        // Reinicia el valor de l'input per permetre seleccionar-lo de nou
        event.target.value = '';
    } else {
        // Si tot és vàlid, actualitzem l'estat
        setFiles(finalFiles);
        event.target.value = '';
    }
  };


  const removeFile = (indexToRemove: number) => {
    setFiles(files => files.filter((_, index) => index !== indexToRemove));
  };
  
  const resetFiles = () => {
      setFiles([]);
  }

  useEffect(() => {
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
      return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    } else {
      setImagePreviews([]);
    }
  }, [files]);

  return { files, imagePreviews, handleFileChange, removeFile, resetFiles };
}