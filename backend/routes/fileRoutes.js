const express =
  require("express");

const router =
  express.Router();

const {
  uploadFile,
  getProjectFiles,
  deleteFile,
  downloadFile,
  getFileDetails,
  uploadNewVersion,
  getVersionHistory,
  getStorageStats,
} = require(
  "../controllers/fileController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

// ===============================
// Upload New File
// ===============================
router.post(
  "/upload",
  protect,
  upload.single(
    "file"
  ),
  uploadFile
);

// ===============================
// Upload New Version
// ===============================
router.post(
  "/:id/version",
  protect,
  upload.single(
    "file"
  ),
  uploadNewVersion
);

// ===============================
// Get All Files Of Project
// ===============================
router.get(
  "/project/:projectId",
  protect,
  getProjectFiles
);

// ===============================
// Get File Details
// ===============================
router.get(
  "/:id",
  protect,
  getFileDetails
);

// ===============================
// Version History
// ===============================
router.get(
  "/:id/versions",
  protect,
  getVersionHistory
);

// ===============================
// Download File
// ===============================
router.get(
  "/:id/download",
  protect,
  downloadFile
);

// ===============================
// Storage Analytics
// ===============================
router.get(
  "/storage/stats",
  protect,
  getStorageStats
);

// ===============================
// Delete File
// ===============================
router.delete(
  "/:id",
  protect,
  deleteFile
);

module.exports =
  router;