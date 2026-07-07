import {
  useEffect,
  useState,
} from "react";

import {
  Upload,
  Download,
  Trash2,
  File,
} from "lucide-react";

import {
  getProjectFiles,
  uploadFile,
  deleteFile,
} from "../../services/fileService";

export default function FileSharingCenter({
  projectId,
}) {
  const [files, setFiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const loadFiles =
    async () => {
      try {
        const data =
          await getProjectFiles(
            projectId
          );

        setFiles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadFiles();
  }, [projectId]);

  const handleUpload =
    async (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      try {
        setUploading(true);

        await uploadFile(
          projectId,
          file
        );

        await loadFiles();

        e.target.value =
          "";
      } catch (error) {
        console.error(error);

        alert(
          "Upload failed"
        );
      } finally {
        setUploading(false);
      }
    };

  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete file?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteFile(id);

        setFiles(
          (prev) =>
            prev.filter(
              (file) =>
                file._id !== id
            )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleDownload =
    async (file) => {
      try {
        const response =
          await fetch(
            file.fileUrl
          );

        const blob =
          await response.blob();

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          file.fileName;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        window.URL.revokeObjectURL(
          url
        );
      } catch (error) {
        console.error(
          "Download Error:",
          error
        );

        window.open(
          file.fileUrl,
          "_blank"
        );
      }
    };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          File Sharing Center
        </h2>

        <label
          className="
            bg-cyan-500
            hover:bg-cyan-600
            px-4
            py-2
            rounded-xl
            cursor-pointer
            flex
            items-center
            gap-2
          "
        >
          <Upload size={18} />

          {uploading
            ? "Uploading..."
            : "Upload"}

          <input
            type="file"
            hidden
            onChange={
              handleUpload
            }
          />
        </label>
      </div>

      {loading ? (
        <div className="text-slate-400">
          Loading files...
        </div>
      ) : files.length ===
        0 ? (
        <div className="text-slate-500">
          No files uploaded yet
        </div>
      ) : (
        <div className="space-y-4">
          {files.map(
            (file) => (
              <div
                key={file._id}
                className="
                  bg-slate-800
                  rounded-2xl
                  p-4
                  flex
                  items-center
                  justify-between
                "
              >
                <div className="flex items-center gap-4">
                  <File
                    size={20}
                    className="text-cyan-400"
                  />

                  <div>
                    <h4 className="font-medium">
                      {
                        file.fileName
                      }
                    </h4>

                    <p className="text-xs text-slate-500">
                      Uploaded by{" "}
                      {
                        file
                          .uploadedBy
                          ?.name
                      }
                    </p>

                    <p className="text-xs text-slate-600">
                      {(
                        file.fileSize /
                        1024
                      ).toFixed(
                        1
                      )}{" "}
                      KB
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleDownload(
                        file
                      )
                    }
                    className="
                      text-cyan-400
                      hover:text-cyan-300
                    "
                    title="Download"
                  >
                    <Download
                      size={18}
                    />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        file._id
                      )
                    }
                    className="
                      text-red-400
                      hover:text-red-300
                    "
                    title="Delete"
                  >
                    <Trash2
                      size={18}
                    />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}