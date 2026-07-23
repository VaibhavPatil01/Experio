import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

const PracticePromoCard = () => {
  return (
    <div className="bg-indigo-50 rounded-lg border border-indigo-100 p-5 mb-4 overflow-hidden relative">
      <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">Practice for your next interview</h3>
      <p className="text-gray-600 text-[13px] mb-5 relative z-10 leading-relaxed max-w-[80%]">
        Explore curated resources and mock interviews tailored for Google.
      </p>
      
      <button className="flex items-center gap-2 bg-white text-primary border border-primary px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-primary hover:text-white transition-colors relative z-10">
        Start Practicing
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Background decoration (mocking the illustration) */}
      <div className="absolute -right-4 -bottom-4 opacity-30 text-indigo-300 pointer-events-none">
        <Target className="w-32 h-32" />
      </div>
    </div>
  );
};

export default PracticePromoCard;
