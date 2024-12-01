"use client"
import { useState } from 'react';

interface AnalysisResult {
  message: string; // General message from the backend
  results: {
    summary: string; // High-level summary of the analysis
    scores: {"name": string, "score": number}[]; // Array of tuples: [category, score]
  };
}

const defaultResults: AnalysisResult = {
  message: "No analysis performed yet.",
  results: {
    summary: "The analysis summary will appear here.",
    scores: [],
  },
};

export default function Home() {
  const [qualityStandards, setQualityStandards] = useState("");
  const [scoringCategories, setScoringCategories] = useState("");
  const [transcript, setTranscript] = useState({});
  const [results, setResults] = useState<AnalysisResult>(defaultResults);

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
        setResults(data);
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
    <div className="bg-indigo-100 h-full w-screen grid grid-cols-2">
      <div>
        <div className="p-8">
          <h1>Standards</h1>
          <textarea
              value={qualityStandards}
              onChange={(e) => setQualityStandards(e.target.value)}
              placeholder="Enter outline of an ideal customer interaction"
              className="resize w-96 h-48"
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

      <div>
      <div className="p-8">
          <h1>Results</h1>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg">Summary:</h2>
            <p className="mb-4">{results.results.summary}</p>
            <h2 className="font-bold text-lg">Category Scores:</h2>
            <ul className="list-disc pl-5">
              {results.results.scores.map((score_pair, index) => (
                <li key={index} className="mb-2">
                  <span className="font-medium">{score_pair["name"]}:</span> {score_pair["score"]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
