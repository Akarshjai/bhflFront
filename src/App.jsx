import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = "https://bfhlback-kaqp.onrender.com/bfhl";

  const handleSubmit = async () => {
    setError("");
    setResponse(null);
    setLoading(true);
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        setError("Invalid format. Ensure it has a 'data' array.");
        setLoading(false);
        return;
      }

      const res = await axios.post(backendURL, parsedJson);
      setResponse(res.data);
    } catch (err) {
      setError("Invalid format or server error.");
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  const renderResponse = () => {
    if (!response) return null;
    return (
      <div className="response-box">
        <h2>Response:</h2>
        <div className="response-detail">
          <p>
            <span>User ID:</span> {response.user_id}
          </p>
          <p>
            <span>Email:</span> {response.email}
          </p>
          <p>
            <span>Roll Number:</span> {response.roll_number}
          </p>
          {selectedFilters.map((filter) => (
            <p key={filter.value}>
              <span>{filter.label}:</span>{" "}
              {response[filter.value]?.join(", ") || "N/A"}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>API Interface</h1>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON e.g., { "data": ["A", "1", "B", "2"] }'
          rows={6}
        />
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
        {response && (
          <>
            <Select
              isMulti
              options={options}
              onChange={setSelectedFilters}
              placeholder="Select Filters"
              className="select-box"
            />
            {renderResponse()}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
