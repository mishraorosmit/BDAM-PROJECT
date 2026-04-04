import React, { useState, useCallback } from "react";

/* ────────────────────────────────────────────────────────────
   Utility — readable file size
   ──────────────────────────────────────────────────────────── */
const formatBytes = (bytes) => {
  if (typeof bytes !== "number" || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/* ────────────────────────────────────────────────────────────
   Mock data generators — deterministic, no crypto deps
   ──────────────────────────────────────────────────────────── */
const mockCID = () =>
  "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

const mockTxHash = () =>
  "0x7a3f9b2e1d4c5a8f0e6b3d7c9a1f2e4b5d8c0a3e6f9b2d5c8a1e4f7b0d3c6a9f";

/* ────────────────────────────────────────────────────────────
   Shared input className
   ──────────────────────────────────────────────────────────── */
const INPUT_CLS =
  "w-full rounded-xl bg-bdam-surface border border-bdam-border " +
  "px-4 py-3 text-sm text-bdam-text placeholder-bdam-muted " +
  "outline-none transition-all duration-200 " +
  "focus:ring-2 focus:ring-bdam-primary focus:border-bdam-primary";

/* ────────────────────────────────────────────────────────────
   UploadForm
   ──────────────────────────────────────────────────────────── */
const UploadForm = () => {
  /* ── State ──────────────────────────────────────────────── */
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({
    file: "",
    name: "",
    description: "",
    price: "",
  });
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Loading state — prevents double-submit and drives the progress UI
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");

  /* ── Derived ────────────────────────────────────────────── */
  const fileName = file?.name ?? "";
  const fileSize = file?.size ?? 0;
  const fileType = file?.type ?? "";

  /* ── Handlers ───────────────────────────────────────────── */
  const extractFile = useCallback((fileList) => {
    if (!fileList || fileList.length === 0) return null;
    const picked = fileList[0];
    return picked instanceof File ? picked : null;
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const selected = extractFile(e?.target?.files);
      if (selected) {
        setFile(selected);
        // Clear file error as soon as a valid file is picked
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    },
    [extractFile],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = extractFile(e?.dataTransfer?.files);
      if (dropped) {
        setFile(dropped);
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    },
    [extractFile],
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    // Show error immediately when the user removes a file
    setErrors((prev) => ({ ...prev, file: "Please select a file to upload." }));
  }, []);

  const handleNameChange = useCallback((e) => {
    const val = e?.target?.value ?? "";
    setName(val);
    // Clear error as soon as the user starts typing a valid name
    if (val.trim().length > 0) {
      setErrors((prev) => (prev.name ? { ...prev, name: "" } : prev));
    }
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    const val = e?.target?.value ?? "";
    setDescription(val);
    if (val.trim().length > 0) {
      setErrors((prev) => (prev.description ? { ...prev, description: "" } : prev));
    }
  }, []);

  const handlePriceChange = useCallback((e) => {
    const raw = e?.target?.value ?? "";
    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
      setPrice(raw);
      // Clear price error when the value becomes a positive number
      const num = Number(raw);
      if (raw.length > 0 && !Number.isNaN(num) && num > 0) {
        setErrors((prev) => (prev.price ? { ...prev, price: "" } : prev));
      }
    }
  }, []);

  const resetForm = useCallback(() => {
    setFile(null);
    setName("");
    setDescription("");
    setPrice("");
    setErrors({ file: "", name: "", description: "", price: "" });
    setSuccess(false);
    setSubmittedData(null);
    setLoading(false);
    setLoadingPhase("");
  }, []);

  /* ── Submit (two-phase simulated upload) ────────────────── */
  const handleSubmit = useCallback(
    (e) => {
      try {
        e.preventDefault();

        // Block double-submit
        if (loading) return;

        // ── Validation ──────────────────────────────────────
        const nextErrors = { file: "", name: "", description: "", price: "" };
        let hasError = false;

        if (!file || !(file instanceof File)) {
          nextErrors.file = "Please select a file to upload.";
          hasError = true;
        }
        if (typeof name !== "string" || name.trim().length === 0) {
          nextErrors.name = "Asset name is required.";
          hasError = true;
        }
        if (typeof description !== "string" || description.trim().length === 0) {
          nextErrors.description = "Description is required.";
          hasError = true;
        }
        const parsedPrice = Number(price);
        if (
          typeof price !== "string" ||
          price.trim().length === 0 ||
          Number.isNaN(parsedPrice) ||
          parsedPrice <= 0
        ) {
          nextErrors.price = "Price must be greater than 0 ETH.";
          hasError = true;
        }

        setErrors(nextErrors);
        if (hasError) return;

        // ── Payload ─────────────────────────────────────────
        const payload = {
          file, fileName, fileSize, fileType,
          name: name.trim(),
          description: description.trim(),
          price,
        };
        console.log("[UploadForm] ⏳ starting upload…", payload);

        // ── Phase 1: Uploading to IPFS (1.5 s) ─────────────
        setLoading(true);
        setLoadingPhase("Uploading to IPFS...");

        setTimeout(() => {
          // ── Phase 2: Confirming transaction (1.5 s) ──────
          setLoadingPhase("Confirming transaction...");

          setTimeout(() => {
            // ── Done ────────────────────────────────────────
            setLoading(false);
            setLoadingPhase("");

            setSubmittedData({
              assetName: name.trim(),
              price,
              cid: mockCID(),
              txHash: mockTxHash(),
            });
            setSuccess(true);

            console.log("[UploadForm] ✅ upload complete");
          }, 1500);
        }, 1500);
      } catch (err) {
        console.error("[UploadForm] ❌ unexpected error:", err);
        setLoading(false);
        setLoadingPhase("");
        setErrors((prev) => ({
          ...prev,
          file: prev.file || "Something went wrong. Please try again.",
        }));
      }
    },
    [file, fileName, fileSize, fileType, name, description, price, loading],
  );

  /* ── Validation ─────────────────────────────────────────── */
  const isFormValid =
    file !== null &&
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    price.length > 0 &&
    Number(price) > 0;

  /* ── Error helper ───────────────────────────────────────── */
  const ErrorMessage = ({ msg }) => {
    if (!msg) return null;
    return (
      <p className="mt-1.5 text-xs text-bdam-error flex items-center gap-1" role="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {msg}
      </p>
    );
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bdam-bg">
      {/* ────────────────────────────────────────────────────
          LOADING CARD
          ──────────────────────────────────────────────────── */}
      {loading ? (
        <div
          className={
            "w-full max-w-lg rounded-2xl border border-bdam-border " +
            "bg-bdam-surface-alt p-12 shadow-card text-bdam-text " +
            "flex flex-col items-center gap-6"
          }
          role="status"
          aria-live="polite"
        >
          {/* spinning ring */}
          <div className="relative w-14 h-14">
            {/* track */}
            <div className="absolute inset-0 rounded-full border-2 border-bdam-border" />
            {/* spinner */}
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-bdam-primary animate-spin"
            />
          </div>

          {/* phase text */}
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-bdam-text">
              {loadingPhase}
            </p>
            <p className="text-xs text-bdam-muted">Please wait — do not close this page.</p>
          </div>

          {/* subtle progress bar */}
          <div className="w-full max-w-[200px] h-1 rounded-full bg-bdam-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-bdam-primary"
              style={{
                animation: "progressPulse 3s ease-in-out infinite",
              }}
            />
          </div>

          {/* inline keyframes (scoped via style tag would need a CSS file;
              using inline style on the bar itself is simpler) */}
          <style>{`
            @keyframes progressPulse {
              0%   { width: 5%;  opacity: 0.6; }
              50%  { width: 80%; opacity: 1;   }
              100% { width: 5%;  opacity: 0.6; }
            }
          `}</style>
        </div>
      ) : success && submittedData ? (
        <div
          className={
            "w-full max-w-lg rounded-2xl border border-bdam-border " +
            "bg-bdam-surface-alt p-8 space-y-6 shadow-card " +
            "text-bdam-text animate-[fadeIn_0.4s_ease]"
          }
          role="status"
        >
          {/* checkmark ring */}
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-bdam-success-soft border-2 border-bdam-success/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-bdam-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* heading */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-bdam-text">Asset Registered</h2>
            <p className="text-sm text-bdam-muted">Your asset has been submitted to the network.</p>
          </div>

          <hr className="border-bdam-border" />

          {/* receipt rows */}
          <div className="space-y-4">
            {/* Asset Name */}
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider mb-1 text-bdam-muted">
                Asset Name
              </span>
              <span className="text-sm font-medium text-bdam-text">
                {submittedData.assetName}
              </span>
            </div>

            {/* Price */}
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider mb-1 text-bdam-muted">
                Price
              </span>
              <span className="text-sm font-medium text-bdam-text">
                {submittedData.price}{" "}
                <span className="text-xs text-bdam-primary">ETH</span>
              </span>
            </div>

            {/* IPFS CID */}
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider mb-1 text-bdam-muted">
                IPFS CID
              </span>
              <div className="rounded-xl bg-bdam-surface border border-bdam-border px-3 py-2.5 text-xs font-mono text-bdam-mono break-all">
                {submittedData.cid}
              </div>
            </div>

            {/* Tx Hash */}
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider mb-1 text-bdam-muted">
                Tx Hash
              </span>
              <div className="rounded-xl bg-bdam-surface border border-bdam-border px-3 py-2.5 text-xs font-mono text-bdam-mono break-all">
                {submittedData.txHash}
              </div>
            </div>
          </div>

          <hr className="border-bdam-border" />

          {/* Upload Another */}
          <button
            type="button"
            onClick={resetForm}
            className={
              "w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide " +
              "bg-bdam-primary text-bdam-text " +
              "hover:bg-bdam-primary-hov hover:scale-[1.015] " +
              "active:scale-[0.985] " +
              "transition-all duration-200 ease-out shadow-lg shadow-bdam-primary/20"
            }
          >
            Upload Another Asset
          </button>
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────
           UPLOAD FORM
           ────────────────────────────────────────────────────── */
        <form
          onSubmit={handleSubmit}
          className={
            "w-full max-w-lg rounded-2xl border border-bdam-border " +
            "bg-bdam-surface-alt p-8 space-y-6 shadow-card text-bdam-text"
          }
        >
          {/* ── Header ── */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-bdam-text">
              Upload Asset
            </h2>
            <p className="text-sm text-bdam-muted">
              Fill in the details below to register your digital asset.
            </p>
          </div>

          <hr className="border-bdam-border" />

          {/* ── File Input ── */}
          <div>
            <label className="block text-sm font-medium mb-2 text-bdam-label">
              File
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={
                "relative flex flex-col items-center justify-center " +
                "rounded-xl border-2 border-dashed min-h-[140px] cursor-pointer " +
                "transition-all duration-200 " +
                (isDragging
                  ? "border-bdam-primary bg-bdam-primary-soft scale-[1.01]"
                  : "border-bdam-border bg-bdam-surface hover:border-bdam-primary/40")
              }
            >
              {file ? (
                <div className="flex flex-col items-center gap-2 py-4 px-6">
                  {/* file icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-bdam-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5
                         a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414
                         5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>

                  <span className="text-sm truncate max-w-[220px] font-medium text-bdam-text">
                    {fileName}
                  </span>

                  <span className="text-xs text-bdam-muted">
                    {formatBytes(fileSize)}
                    {fileType ? ` · ${fileType}` : ""}
                  </span>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className={
                      "text-xs mt-1 px-3 py-1 rounded-lg border " +
                      "border-bdam-error/20 text-bdam-error " +
                      "hover:bg-bdam-error-soft transition-colors duration-150"
                    }
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 py-6 px-6 cursor-pointer w-full h-full">
                  {/* upload icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-bdam-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7
                         10l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                  <span className="text-sm text-bdam-muted">
                    Drag & drop or{" "}
                    <span className="text-bdam-primary font-medium">browse</span>
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <ErrorMessage msg={errors.file} />
          </div>

          {/* ── Asset Name ── */}
          <div>
            <label htmlFor="assetName" className="block text-sm font-medium mb-2 text-bdam-label">
              Asset Name
            </label>
            <input
              id="assetName"
              type="text"
              placeholder="e.g. Sunset Photograph #12"
              value={name}
              onChange={handleNameChange}
              className={INPUT_CLS}
            />
            <ErrorMessage msg={errors.name} />
          </div>

          {/* ── Description ── */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-bdam-label">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe your asset..."
              value={description}
              onChange={handleDescriptionChange}
              className={INPUT_CLS + " resize-none"}
            />
            <ErrorMessage msg={errors.description} />
          </div>

          {/* ── Price ── */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2 text-bdam-label">
              Price (ETH)
            </label>
            <div className="relative">
              <input
                id="price"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={price}
                onChange={handlePriceChange}
                className={INPUT_CLS + " pr-16"}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-bdam-primary">
                ETH
              </span>
            </div>
            <ErrorMessage msg={errors.price} />
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={
              "w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide " +
              "transition-all duration-200 ease-out " +
              "flex items-center justify-center gap-2 " +
              (isFormValid && !loading
                ? "bg-bdam-primary text-bdam-text hover:bg-bdam-primary-hov " +
                  "hover:scale-[1.015] active:scale-[0.985] " +
                  "shadow-lg shadow-bdam-primary/20 cursor-pointer"
                : "bg-bdam-surface text-bdam-muted cursor-not-allowed")
            }
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? "Processing..." : "Upload Asset"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadForm;
