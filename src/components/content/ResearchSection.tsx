'use client';

import { Search, ExternalLink } from 'lucide-react';

interface ResearchSectionProps {
  research: {
    topic?: string;
    points?: string[];
    sources?: string[];
    insights?: string[];
  };
}

export function ResearchSection({ research }: ResearchSectionProps) {
  // Determine which format we're using
  const researchPoints = research.points || research.insights || [];
  const sources = research.sources || [];

  if (!researchPoints.length) {
    return null;
  }

  // Debug logging
  console.log('Research data:', { researchPoints, sources });

  return (
    <div className="space-y-4">
      {/* Research Insights */}
      <div className="bg-white border border-green-200 rounded-xl p-6">
        <h5 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
          <Search className="h-5 w-5 text-green-600" />
          <span>Research Insights</span>
        </h5>

        <div className="space-y-3">
          {researchPoints.map((point, index) => {
            // Try to match this insight with a corresponding source
            const correspondingSource = sources[index];

            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed">
                    {point}
                    {correspondingSource && (
                      <a
                        href={correspondingSource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title={`Source: ${correspondingSource}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sources Section (if there are more sources than insights) */}
        {sources.length > researchPoints.length && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h6 className="text-sm font-medium text-gray-900 mb-3">Additional Sources</h6>
            <div className="space-y-2">
              {sources.slice(researchPoints.length).map((source, index) => (
                <a
                  key={index + researchPoints.length}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{source}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}