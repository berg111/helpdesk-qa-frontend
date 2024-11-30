"use client"
import { useState } from 'react';

export default function Home() {
  const [qualityStandards, setQualityStandards] = useState("");

  return (
    <div className="bg-indigo-100 h-screen w-screen">
      <div className="grid grid-cols-1 w-1/2">
        <h1>Standards</h1>
        <textarea
            value={qualityStandards}
            onChange={(e) => setQualityStandards(e.target.value)}
            placeholder="Enter outline of an ideal customer interaction"
            className="resize"
        />
      </div>
      
    </div>
  );
}
