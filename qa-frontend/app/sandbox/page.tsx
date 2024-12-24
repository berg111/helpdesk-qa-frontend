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

export default function Sandbox() {
  const [qualityStandards, setQualityStandards] = useState("");
  const [scoringCategories, setScoringCategories] = useState("");
  const [transcript, setTranscript] = useState({});
  const [results, setResults] = useState<AnalysisResult>(defaultResults);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

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

  const handleAudioFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setAudioFiles(filesArray);
      console.log("Audio files selected:", filesArray.map((file) => file.name));
    }
  };

  const handleAudioUpload = async () => {
    if (audioFiles.length === 0) {
      alert("Please select one or more audio files to upload.");
      return;
    }

    if (audioFiles.length > 10) {
      alert("Audio uploads are limited to 10 files per request.");
      return;
    }
  
    const formData = new FormData();
    audioFiles.forEach((file) => {
      formData.append("audio_files", file); // Adjust the key as expected by your backend
    });
    // Test data
    formData.append("category_ids", [1].join(","));
    formData.append("question_ids", [1].join(","));
    formData.append("organization_id", "2");
    formData.append("agent_id", "1");
    formData.append("standard_id", "1");
  
    try {
      const response = await fetch("http://127.0.0.1:5000/upload-and-analyze", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Audio upload response:", data);
        alert("Audio uploaded successfully!");
      } else {
        console.error("Failed to upload audio:", response.statusText);
        alert("Audio upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during audio upload:", error);
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

        <div>
          <h1>Upload Call Audio</h1>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleAudioFileSelect}
          />
          <button
            onClick={handleAudioUpload}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded hover:bg-green-600"
          >
            Upload Audio
          </button>
          {audioFiles.length > 0 && (
            <ul className="mt-4">
              {audioFiles.map((file, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {file.name}
                </li>
              ))}
            </ul>
          )}
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
