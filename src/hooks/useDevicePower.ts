// File: src/hooks/useDevicePower.ts
'use client';

import { useState, useEffect } from 'react';

interface DevicePower {
  tier: 'LOW' | 'MEDIUM' | 'HIGH';
  maxVideoDuration: number; // in minutes
  ram: number;
  cores: number;
}

export function useDevicePower() {
  const [power, setPower] = useState<DevicePower>({
    tier: 'LOW',
    maxVideoDuration: 3, 
    ram: 4,
    cores: 4,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cores = navigator.hardwareConcurrency || 4;
      const ram = (navigator as any).deviceMemory || 4; 

      let tier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      let maxDuration = 3; 

      if (ram >= 8 && cores >= 8) {
        tier = 'HIGH';
        maxDuration = 15; 
      } else if (ram >= 6 || cores >= 6) {
        tier = 'MEDIUM';
        maxDuration = 8; 
      } else {
        tier = 'LOW';
        maxDuration = 3; 
      }

      setPower({ tier, maxVideoDuration: maxDuration, ram, cores });
    }
  }, []);

  return power;
}