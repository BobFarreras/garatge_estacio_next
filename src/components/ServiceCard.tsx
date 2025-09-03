"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
};

const ServiceCard = ({ icon, title, description, link, linkText }: ServiceCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col text-center items-center"
  >
    <div className="bg-red-100 p-4 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 mb-6 flex-grow">{description}</p>
    <Button asChild className="mt-auto w-full bg-red-600 hover:bg-red-700">
      <Link href={link}>{linkText}</Link>
    </Button>
  </motion.div>
);

export default ServiceCard;