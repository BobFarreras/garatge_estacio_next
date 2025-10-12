import Image from 'next/image';
import imatgeFaçana from "@/../public/images/façana.jpeg";

export const ContactHeader = () => {
    return (
        <section className="relative py-24 min-h-[400px] md:min-h-[500px] bg-gray-900 text-white flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60"></div>
            <Image
                fill
                priority
                className="object-cover"
                alt="Contacte Garatge Estació"
                src={imatgeFaçana}
                sizes="100vw"
            />
        </section>
    );
};