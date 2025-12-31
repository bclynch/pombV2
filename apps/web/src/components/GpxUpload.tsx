import { useRef } from "react";
import { useTripUpload } from "../hooks/useTripUpload";

interface GpxUploadProps {
  tripId: string;
  onUploadComplete?: () => void;
}

export function GpxUpload({ tripId, onUploadComplete }: GpxUploadProps) {
  const { upload, progress, error } = useTripUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const gpxFiles = Array.from(files).filter(
      (file) => file.name.toLowerCase().endsWith(".gpx") || file.type.includes("gpx") || file.type.includes("xml")
    );

    if (gpxFiles.length === 0) {
      alert("Please select GPX files (.gpx)");
      return;
    }

    await upload(tripId, gpxFiles);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    alert("Trip updated with GPX data!");
    onUploadComplete?.();
  };

  const isProcessing = ["parsing", "uploading", "saving"].includes(progress.phase);

  return (
    <div style={{ marginTop: "12px" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".gpx,application/gpx+xml,text/xml"
        multiple
        onChange={handleFileChange}
        disabled={isProcessing}
        style={{ display: "none" }}
        id={`gpx-upload-${tripId}`}
      />
      <label
        htmlFor={`gpx-upload-${tripId}`}
        style={{
          display: "inline-block",
          padding: "8px 16px",
          backgroundColor: isProcessing ? "#ccc" : "#0052ff",
          color: "white",
          borderRadius: "6px",
          cursor: isProcessing ? "not-allowed" : "pointer",
          fontSize: "14px",
        }}
      >
        {isProcessing ? progress.message : "Add GPX Files"}
      </label>

      {isProcessing && progress.total > 0 && (
        <div style={{ marginTop: "8px" }}>
          <div
            style={{
              width: "100%",
              height: "4px",
              backgroundColor: "#e0e0e0",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
                height: "100%",
                backgroundColor: "#0052ff",
                transition: "width 0.2s",
              }}
            />
          </div>
          <span style={{ fontSize: "12px", color: "#666" }}>
            {progress.current} of {progress.total}
          </span>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#fee",
            borderRadius: "4px",
            fontSize: "14px",
            color: "#c00",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
