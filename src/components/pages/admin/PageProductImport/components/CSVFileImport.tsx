import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

type CSVFileImportProps = {
  url: string; // The API endpoint for generating the signed URL
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      setIsUploading(true);

      // Step 1: Get the presigned URL from the backend
      console.log("Uploading file to:", url);
      const authorization_token = localStorage.getItem('authorization_token');
      const response = await axios.get<{ signedUrl: string }>(url, {
        params: {
          name: encodeURIComponent(file.name), // Pass the file name as a query parameter
        },
        headers: {
          authorization: `Basic ${authorization_token}`,
        },
      });

      const signedUrl = response.data.signedUrl;

      console.log("File to upload:", file.name);
      console.log("Uploading to:", signedUrl);

      // Step 2: Upload the file to S3 using the signed URL
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "text/csv", // Ensure the content type matches what your Lambda expects
        },
      });

      console.log("File uploaded successfully!");
      alert("File uploaded successfully!");
      setFile(null); // Clear the file after a successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" accept=".csv" onChange={onFileChange} />
      ) : (
        <Box>
          <Typography>{file.name}</Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={removeFile}
            disabled={isUploading}
            sx={{ mr: 2 }}
          >
            Remove File
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={uploadFile}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
}