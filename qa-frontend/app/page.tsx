"use client"
import { useState } from 'react';

export default function Home() {
  const [qualityStandards, setQualityStandards] = useState("");
  const [scoringCategories, setScoringCategories] = useState("");
  const [transcript, setTranscript] = useState({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonContent = JSON.parse(e.target?.result as string);
        console.log("Uploaded JSON Content:", jsonContent);
        // Use `jsonContent` for further processing
        setTranscript(jsonContent);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      transcript: transcript,
      categories: scoringCategories,
      standards: qualityStandards,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response from backend:", data);
        alert("Submission successful!");
      } else {
        console.error("Failed to submit:", response.statusText);
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-indigo-100 h-full w-screen">
      <div className="p-8">
        <h1>Standards</h1>
        <textarea
            value={qualityStandards}
            onChange={(e) => setQualityStandards(e.target.value)}
            placeholder="Enter outline of an ideal customer interaction"
            className="resize w-96 h-96"
        />
      </div>

      <div className="p-8">
        <h1>Categories</h1>
        <textarea
            value={scoringCategories}
            onChange={(e) => setScoringCategories(e.target.value)}
            placeholder="Enter categories to score on."
            className="resize w-96 h-48"
        />
      </div>

      <div className="p-8">
        <h1>Upload transcript</h1>
        <input
          type="file"
          accept="application/json"
          onChange={handleFileUpload}
        />
      </div>

      <div className="p-8">
        <button
          onClick={handleSubmit}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Submit
        </button>
      </div>
      
    </div>
  );
}
