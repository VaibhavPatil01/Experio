import React from 'react';
import { ArrowRight } from 'lucide-react';
import arrowSvgContent from '../../../../assets/images/icons/arrow-Photoroom.svg?raw';

const PracticePromoCard = () => {
  return (
    <div className="bg-primary/10 rounded-lg border border-primary/20 p-5 mb-4 overflow-hidden relative">
      <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">Practice for your next interview</h3>
      <p className="text-gray-600 text-[13px] mb-5 relative z-10 leading-relaxed max-w-[80%]">
        Explore curated resources and mock interviews tailored for Google.
      </p>
      
      <button className="flex items-center gap-2 bg-white text-primary border border-primary px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-primary hover:text-white transition-colors relative z-10">
        Start Practicing
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Background decoration */}
      <div 
        className="absolute right-0 bottom-0 pointer-events-none opacity-80 text-primary [&>svg]:w-32 [&>svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: arrowSvgContent }}
      />
    </div>
  );
};

export default PracticePromoCard;
