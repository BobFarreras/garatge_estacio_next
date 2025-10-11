import { StaticImageData } from 'next/image';

// ✅ Definimos un tipo para nuestros objetos de servicio para más seguridad
export type Service = {
    id: number;
    title: string;
    description: string;
    image: StaticImageData;
    icon: React.ElementType;
}