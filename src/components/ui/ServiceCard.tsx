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
  index: number;
};

const ServiceCard = ({ icon, title, description, link, linkText, index }: ServiceCardProps) => (
  <motion.div
    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <div className="mb-5">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 mb-6 flex-grow">{description}</p>
    <Button asChild className="mt-auto w-full bg-red-600 hover:bg-red-700">
      <Link href={link}>{linkText}</Link>
    </Button>
  </motion.div>
);

export default ServiceCard;