import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./index.css"; // Make sure your CSS is imported

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Track whether the input JSON is valid
  const [isJsonValid, setIsJsonValid] = useState(false);

  // Use your actual backend URL here
  const backendURL = "https://bfhlback-kaqp.onrender.com/bfhl";

  const handleSubmit = async () => {
    setError("");
    setResponse(null);
    setLoading(true);

    try {
      const parsedJson = JSON.parse(jsonInput);
      // Basic validation check: must have 'data' array
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        setError("Invalid format. Ensure it has a 'data' array.");
        setIsJsonValid(false);
        setLoading(false);
        return;
      }

      // If JSON is valid, set flag to true
      setIsJsonValid(true);

      // Proceed to make the request
      const res = await axios.post(backendURL, parsedJson);
      setResponse(res.data);
    } catch (err) {
      setError("Invalid format or server error.");
      setIsJsonValid(false);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  const handleFilterApply = () => {
    // Optional: implement additional client-side filtering here if desired
  };

  return (
    <div className="app-container">
      <h1 className="title">Interactive API Interface</h1>

      <div className="card">
        {/* Input Section */}
        <div className="input-section">
          <h2>Input JSON</h2>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='e.g., { "data": ["A", "1", "B", "2"] }'
            rows={4}
            className="json-textarea"
          />
          {error && <div className="error-message">{error}</div>}

          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>

        {/* Show the Multi Filter only if JSON is valid */}
        {isJsonValid && (
          <div className="filter-section">
            <h2>Multi Filter</h2>
            <Select
              isMulti
              options={filterOptions}
              onChange={setSelectedFilters}
              placeholder="Select Filters"
              className="select-box"
            />
            <button className="btn filter-btn" onClick={handleFilterApply}>
              Apply Filters
            </button>
          </div>
        )}

        {/* Response Section (if the server returned data) */}
        {response && (
          <div className="response-box fade-in">
            <h2>Filtered Response</h2>
            {selectedFilters.map((filter) => (
              <p key={filter.value} className="filter-response">
                <strong>{filter.label}:</strong>{" "}
                {response[filter.value]?.join(", ") || "N/A"}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
