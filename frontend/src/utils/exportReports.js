import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ======================================
// Format Date
// ======================================

const formatDate = () => {
  return new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

// ======================================
// File Name
// ======================================

const getFileName = (title, extension) => {
  const date = new Date().toISOString().split("T")[0];

  return `TaskFlow_${title.replace(/\s+/g, "_")}_${date}.${extension}`;
};

// ======================================
// Convert Nested Objects
// ======================================

const normalizeData = (data = []) => {
  return data.map((row) => {
    const result = {};

    Object.entries(row).forEach(([key, value]) => {
      if (
        value instanceof Date
      ) {
        result[key] =
          value.toLocaleDateString();
      }

      else if (
        value &&
        typeof value === "object"
      ) {
        if (value.name) {
          result[key] = value.name;
        }

        else if (value.title) {
          result[key] = value.title;
        }

        else if (value.email) {
          result[key] = value.email;
        }

        else if (
          Array.isArray(value)
        ) {
          result[key] =
            value.join(", ");
        }

        else {
          result[key] =
            JSON.stringify(value);
        }
      }

      else {
        result[key] = value;
      }
    });

    return result;
  });
};

// ======================================
// Export PDF
// ======================================

export const exportPDF = (
  title,
  data
) => {

  const rows =
    normalizeData(data);

  const doc =
    new jsPDF();

  doc.setFontSize(22);

  doc.setTextColor(
    6,
    182,
    212
  );

  doc.text(
    "TaskFlow Enterprise",
    14,
    18
  );

  doc.setFontSize(16);

  doc.setTextColor(
    40
  );

  doc.text(
    title,
    14,
    30
  );

  doc.setFontSize(10);

  doc.setTextColor(
    120
  );

  doc.text(
    `Generated : ${formatDate()}`,
    14,
    38
  );

  doc.text(
    `Total Records : ${rows.length}`,
    14,
    45
  );

  if (!rows.length) {

    doc.setFontSize(14);

    doc.text(
      "No data available.",
      14,
      60
    );

    doc.save(
      getFileName(
        title,
        "pdf"
      )
    );

    return;
  }

  autoTable(doc, {

    startY: 55,

    head: [
      Object.keys(rows[0])
    ],

    body: rows.map(
      (item) =>
        Object.values(item)
    ),

    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [
        6,
        182,
        212,
      ],

      textColor: 255,

      halign: "center",
    },

    alternateRowStyles: {
      fillColor: [
        245,
        248,
        250,
      ],
    },

    didDrawPage(data) {

      const pageSize =
        doc.internal.pageSize;

      const pageHeight =
        pageSize.height
          ? pageSize.height
          : pageSize.getHeight();

      doc.setFontSize(9);

      doc.setTextColor(
        150
      );

      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        pageSize.width - 30,
        pageHeight - 10
      );
    },

  });

  doc.save(
    getFileName(
      title,
      "pdf"
    )
  );
};
// ======================================
// Export Excel
// ======================================

export const exportExcel = (
  title,
  data
) => {

  const rows =
    normalizeData(data);

  if (!rows.length) {
    return;
  }

  const worksheet =
    XLSX.utils.json_to_sheet(
      rows
    );

  // Auto column width
  const columnWidths =
    Object.keys(rows[0]).map(
      (key) => ({
        wch: Math.max(
          key.length + 5,
          ...rows.map((row) =>
            String(row[key] ?? "")
              .length + 5
          )
        ),
      })
    );

  worksheet["!cols"] =
    columnWidths;

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    title
  );

  XLSX.writeFile(
    workbook,
    getFileName(
      title,
      "xlsx"
    )
  );
};

// ======================================
// Export CSV
// ======================================

export const exportCSV = (
  title,
  data
) => {

  const rows =
    normalizeData(data);

  if (!rows.length) {
    return;
  }

  const worksheet =
    XLSX.utils.json_to_sheet(
      rows
    );

  const csv =
    XLSX.utils.sheet_to_csv(
      worksheet
    );

  const blob =
    new Blob(
      [
        "\uFEFF" + csv,
      ],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

  saveAs(
    blob,
    getFileName(
      title,
      "csv"
    )
  );
};