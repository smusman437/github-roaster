"use client";
import React, { useState } from "react";

const GitHubRoaster = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const extractUsername = (url) => {
    const matches = url.match(/github\.com\/([^\/]+)|^[^\/]+$/);
    return matches ? matches[1] || url : null;
  };

  const generateRoast = async () => {
    setLoading(true);
    setError("");
    setRoast("");

    try {
      const username = extractUsername(githubUrl);
      if (!username) {
        throw new Error("Invalid GitHub URL or username");
      }

      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error("GitHub profile not found");
      }

      const userData = await response.json();

      const roastResponse = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          created_at: userData.created_at,
          bio: userData.bio,
        }),
      });

      console.log("roastResponse:", roastResponse);

      if (!roastResponse.ok) {
        throw new Error("Failed to generate roast");
      }

      const roastData = await roastResponse.json();
      setRoast(roastData.roast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          GitHub Profile Roaster 🔥
        </h1>

        <div className="space-y-6">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter GitHub profile URL or username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={generateRoast}
              disabled={loading || !githubUrl}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors duration-150
                ${
                  loading || !githubUrl
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Roasting...
                </div>
              ) : (
                "Roast!"
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {roast && (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-800 leading-relaxed">{roast}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubRoaster;
