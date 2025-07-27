import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/dashboard" className={`flex items-center space-x-3 ${className}`}>
      <div className="w-10 h-10 bg-brand-dark rounded-lg flex items-center justify-center">
        <Heart className="w-6 h-6 text-white" />
      </div>
      <span className="font-bold text-xl text-brand-dark dark:text-white">
        Arogya Sahayak
      </span>
    </Link>
  );
}
