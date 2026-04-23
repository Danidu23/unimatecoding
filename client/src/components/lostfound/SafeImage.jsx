import React, { useEffect, useMemo, useState } from 'react';

export default function SafeImage({ src, alt, fallbackCandidates = [], ...rest }) {
  const candidates = useMemo(() => [src, ...fallbackCandidates].filter(Boolean), [src, fallbackCandidates]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [src]);

  const currentSrc = candidates[Math.min(index, Math.max(candidates.length - 1, 0))] || src;

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (index < candidates.length - 1) {
          setIndex(index + 1);
        }
      }}
      {...rest}
    />
  );
}
