import { ContactForm } from './_components/ContactForm';
import { ContactHeader } from './_components/ContactHeader';
import { ContactInfo } from './_components/ContactInfo';

const ContactePage = () => {
    return (
        <div className="bg-white">
            <ContactHeader />
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <ContactInfo />
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactePage;