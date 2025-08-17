import React, { useState } from "react";
import axios from "axios";

const ExcelUploader = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // <-- Must be "file"

    try {
      const response = await axios.post("http://localhost:5000/upload-movies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} style={{ marginTop: 10 }}>
        Upload
      </button>
      <p>{message}</p>
    </div>
  );
};

export default ExcelUploader;

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
  },
  input: {
    padding: "8px",
    fontSize: "1rem",
    width: "250px",
    margin: "10px",
    borderRadius: "5px",
  },
  submitButton: {
    padding: "0.5rem 2rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "20px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

// export default MovieUploadForm;
