'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CaseTagsProps {
  tags: string[];
  maxTags?: number;
}

const CaseTags = ({ tags, maxTags = 2 }: CaseTagsProps) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = tags.slice(0, maxTags);
  const remainingCount = Math.max(0, tags.length - maxTags);

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default CaseTags;
