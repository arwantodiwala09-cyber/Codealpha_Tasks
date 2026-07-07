const streamifier =
  require("streamifier");

const cloudinary =
  require("../config/cloudinary");

const File =
  require("../models/File");

const FileVersion =
  require("../models/FileVersion");

const {
  getIO,
} = require(
  "../socket/socket"
);

const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
];

// Upload File
const uploadFile =
  async (req, res) => {
    try {
      const {
        projectId,
      } = req.body;

      if (
        !projectId
      ) {
        return res
          .status(400)
          .json({
            message:
              "Project ID required",
          });
      }

      if (
        !req.file
      ) {
        return res
          .status(400)
          .json({
            message:
              "No file uploaded",
          });
      }

      const resourceType =
        DOCUMENT_TYPES.includes(
          req.file.mimetype
        )
          ? "raw"
          : "image";

      const uploadResult =
        await new Promise(
          (
            resolve,
            reject
          ) => {
            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "taskflow-files",
                  resource_type:
                    resourceType,
                },
                (
                  error,
                  result
                ) => {
                  if (
                    error
                  ) {
                    reject(
                      error
                    );
                  } else {
                    resolve(
                      result
                    );
                  }
                }
              );

            streamifier
              .createReadStream(
                req.file
                  .buffer
              )
              .pipe(
                stream
              );
          }
        );

      console.log(
        "UPLOAD RESULT:",
        uploadResult
      );

      let fileUrl =
        uploadResult.secure_url;

      if (
        resourceType ===
        "raw"
      ) {
        fileUrl =
          cloudinary.url(
            uploadResult.public_id,
            {
              resource_type:
                "raw",
              secure: true,
            }
          );
      }

      const file =
        await File.create(
          {
            project:
              projectId,

            uploadedBy:
              req.user
                ._id,

            fileName:
              req.file
                .originalname,

            fileUrl,

            publicId:
              uploadResult.public_id,

            fileType:
              req.file
                .mimetype,

            fileSize:
              req.file
                .size,
          }
        );

      const populatedFile =
        await File.findById(
          file._id
        )
          .populate(
            "uploadedBy",
            "name email"
          )
          .populate(
            "project",
            "name"
          );

      try {
        getIO().emit(
          "fileUploaded",
          populatedFile
        );
      } catch (
        socketError
      ) {
        console.error(
          "Socket Error:",
          socketError.message
        );
      }

      res
        .status(201)
        .json(
          populatedFile
        );
    } catch (
      error
    ) {
      console.error(
        "FILE UPLOAD ERROR:"
      );

      console.error(
        error
      );

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

// Get Project Files
const getProjectFiles =
  async (req, res) => {
    try {
      const files =
        await File.find(
          {
            project:
              req.params
                .projectId,
          }
        )
          .populate(
            "uploadedBy",
            "name email"
          )
          .sort({
            createdAt:
              -1,
          });

      res.json(
        files
      );
    } catch (
      error
    ) {
      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

// Delete File
const deleteFile =
  async (req, res) => {
    try {
      const file =
        await File.findById(
          req.params.id
        );

      if (
        !file
      ) {
        return res
          .status(404)
          .json({
            message:
              "File not found",
          });
      }

      const isOwner =
        file.uploadedBy.toString() ===
        req.user._id.toString();

      const isAdmin =
        req.user.role ===
        "Admin";

      if (
        !isOwner &&
        !isAdmin
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not authorized",
          });
      }

      const resourceType =
        DOCUMENT_TYPES.includes(
          file.fileType
        )
          ? "raw"
          : "image";

      await cloudinary.uploader.destroy(
        file.publicId,
        {
          resource_type:
            resourceType,
        }
      );

      const fileId =
        file._id;

      await file.deleteOne();

      try {
        getIO().emit(
          "fileDeleted",
          {
            fileId,
          }
        );
      } catch (
        socketError
      ) {
        console.error(
          "Socket Error:",
          socketError.message
        );
      }

      res.json({
        message:
          "File deleted successfully",
      });
    } catch (
      error
    ) {
      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };
// Get File Details
const getFileDetails =
  async (req, res) => {
    try {
      const file =
        await File.findById(
          req.params.id
        )
          .populate(
            "uploadedBy",
            "name email"
          )
          .populate(
            "project",
            "name"
          )
          .populate({
            path: "versions",
            populate: {
              path: "uploadedBy",
              select: "name email",
            },
            options: {
              sort: {
                version: -1,
              },
            },
          });

      if (
        !file ||
        file.isDeleted
      ) {
        return res
          .status(404)
          .json({
            message:
              "File not found",
          });
      }

      res.json(file);
    } catch (
      error
    ) {
      console.error(
        "Get File Details Error:",
        error
      );

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

// Download File
const downloadFile =
  async (req, res) => {
    try {
      const file =
        await File.findById(
          req.params.id
        );

      if (
        !file ||
        file.isDeleted
      ) {
        return res
          .status(404)
          .json({
            message:
              "File not found",
          });
      }

      file.downloadCount += 1;

      await file.save();

      return res.redirect(
        file.fileUrl
      );
    } catch (
      error
    ) {
      console.error(
        "Download Error:",
        error
      );

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };
  // Upload New Version
const uploadNewVersion =
  async (req, res) => {
    try {
      const file =
        await File.findById(
          req.params.id
        );

      if (
        !file ||
        file.isDeleted
      ) {
        return res
          .status(404)
          .json({
            message:
              "File not found",
          });
      }

      if (
        !req.file
      ) {
        return res
          .status(400)
          .json({
            message:
              "No file uploaded",
          });
      }

      const resourceType =
        DOCUMENT_TYPES.includes(
          req.file.mimetype
        )
          ? "raw"
          : "image";

      const uploadResult =
        await new Promise(
          (
            resolve,
            reject
          ) => {
            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "taskflow-files",
                  resource_type:
                    resourceType,
                },
                (
                  error,
                  result
                ) => {
                  if (
                    error
                  ) {
                    reject(
                      error
                    );
                  } else {
                    resolve(
                      result
                    );
                  }
                }
              );

            streamifier
              .createReadStream(
                req.file.buffer
              )
              .pipe(
                stream
              );
          }
        );

      const previousVersion =
        await FileVersion.create(
          {
            file:
              file._id,

            version:
              file.currentVersion,

            originalName:
              file.fileName,

            filename:
              file.fileName,

            mimeType:
              file.fileType,

            size:
              file.fileSize,

            uploadedBy:
              file.uploadedBy,

            fileUrl:
              file.fileUrl,

            publicId:
              file.publicId,
          }
        );

      file.versions.push(
        previousVersion._id
      );

      file.currentVersion += 1;

      file.fileName =
        req.file.originalname;

      file.originalName =
        req.file.originalname;

      file.fileType =
        req.file.mimetype;

      file.fileSize =
        req.file.size;

      file.fileUrl =
        uploadResult.secure_url;

      file.publicId =
        uploadResult.public_id;

      file.lastModified =
        new Date();

      await file.save();

      const updatedFile =
        await File.findById(
          file._id
        )
          .populate(
            "uploadedBy",
            "name email"
          )
          .populate(
            "project",
            "name"
          )
          .populate(
            "versions"
          );

      try {
        getIO().emit(
          "fileVersionUploaded",
          updatedFile
        );
      } catch (
        socketError
      ) {
        console.error(
          socketError
        );
      }

      res.json(
        updatedFile
      );
    } catch (
      error
    ) {
      console.error(
        "Upload Version Error:",
        error
      );

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };
  // Get Version History
const getVersionHistory =
  async (req, res) => {
    try {
      const file =
        await File.findById(
          req.params.id
        ).populate({
          path: "versions",
          populate: {
            path: "uploadedBy",
            select: "name email",
          },
          options: {
            sort: {
              version: -1,
            },
          },
        });

      if (
        !file ||
        file.isDeleted
      ) {
        return res
          .status(404)
          .json({
            message:
              "File not found",
          });
      }

      res.json({
        currentVersion:
          file.currentVersion,
        versions:
          file.versions,
      });
    } catch (
      error
    ) {
      console.error(
        "Version History Error:",
        error
      );

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

// Storage Statistics
const getStorageStats =
  async (req, res) => {
    try {
      const stats =
        await File.aggregate([
          {
            $match: {
              isDeleted: false,
            },
          },
          {
            $group: {
              _id: null,
              totalFiles: {
                $sum: 1,
              },
              totalStorage: {
                $sum:
                  "$fileSize",
              },
              totalDownloads: {
                $sum:
                  "$downloadCount",
              },
              averageFileSize: {
                $avg:
                  "$fileSize",
              },
            },
          },
        ]);

      res.json(
        stats[0] || {
          totalFiles: 0,
          totalStorage: 0,
          totalDownloads: 0,
          averageFileSize: 0,
        }
      );
    } catch (
      error
    ) {
      console.error(
        "Storage Stats Error:",
        error
      );

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };
module.exports = {
  uploadFile,
  getProjectFiles,
  deleteFile,
  getFileDetails,
  downloadFile,
  uploadNewVersion,
  getVersionHistory,
  getStorageStats,
};