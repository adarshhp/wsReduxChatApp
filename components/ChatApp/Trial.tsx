import React, { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const Trial = () => {
  const [base64PDF, setBase64PDF] = useState<string>("");
  //const [tablebase64PDF, tablesetBase64PDF] = useState<string>("");

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const base64 = await convertFileToBase64(file);
    setBase64PDF(base64);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]); // Remove data prefix
        } else {
          reject("Error reading file.");
        }
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleDecode = () => {
    if (!base64PDF) {
      alert("No PDF data available.");
      return;
    }

    const byteCharacters = atob(base64PDF);
    const byteNumbers = Array.from(byteCharacters).map((char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "uploaded-decoded.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    const { departmentNames } = sampledata;

    const columns = [
      "departmentMasterId",
      "departmentCode",
      "departmentName",
      "adepartmentMasterId",
      "bdepartmentName",
      "cdepartmentCode",
      "ddepartmentMasterId",
      "edepartmentName",
      "fdepartmentCode",
      "gdepartmentMasterId",
      "hdepartmentName",
      "idepartmentCode",
      "jdepartmentMasterId",
      "kdepartmentName",
      "ldepartmentCode",
      "mdepartmentMasterId",
      "ndepartmentName",
      "odepartmentCode",
      "pdepartmentMasterId",
      "qdepartmentName",
      "rdepartmentCode",
      "sdepartmentMasterId",
      "tdepartmentName",
      "udepartmentCode",
    ];

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height, width } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 8;
    const rowHeight = 15;
    const startX = 30;
    const startY = height - 50;

    page.setFont(font);
    page.setFontSize(fontSize);

    // Header
    page.drawText("Department List", {
      x: startX,
      y: startY + 20,
      size: 14,
      color: rgb(0, 0, 0),
    });

    // Column headers
    columns.forEach((col, colIndex) => {
      const x = startX + colIndex * 80;
      if (x + 80 < width) {
        page.drawText(col, {
          x,
          y: startY,
        });
      }
    });

    // Table rows
    departmentNames.forEach((dept, rowIndex) => {
      const y = startY - (rowIndex + 1) * rowHeight;

      columns.forEach((col, colIndex) => {
        const value = dept[col] !== undefined ? String(dept[col]) : "-";
        const x = startX + colIndex * 80;

        if (x + 80 < width && y > 50) {
          page.drawText(value, {
            x,
            y,
            size: fontSize,
          });
        }
      });
    });

    const pdfBytes = await pdfDoc.save();

    // Convert to base64
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(pdfBytes))
    );

   // tablesetBase64PDF(base64String);

    // Decode and download
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters).map((char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table-data.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sampledata = {
    code: 200,
    message: "Success",
    departmentNames: [
      {
        departmentMasterId: 18,
        departmentName: "Dermatology",
        departmentCode: "DR284",
        adepartmentMasterId: 18,
        bdepartmentName: "Dermatology",
        cdepartmentCode: "DR284",
        ddepartmentMasterId: 18,
        edepartmentName: "Dermatology",
        fdepartmentCode: "DR284",
        gdepartmentMasterId: 18,
        hdepartmentName: "Dermatology",
        idepartmentCode: "DR284",
        jdepartmentMasterId: 18,
        kdepartmentName: "Dermatology",
        ldepartmentCode: "DR284",
        mdepartmentMasterId: 18,
        ndepartmentName: "Dermatology",
        odepartmentCode: "DR284",
        pdepartmentMasterId: 18,
        qdepartmentName: "Dermatology",
        rdepartmentCode: "DR284",
        sdepartmentMasterId: 18,
        tdepartmentName: "Dermatology",
        udepartmentCode: "DR284",
      },
      {
        departmentMasterId: 105,
        departmentName: "ITExS",
        departmentCode: "ITE002",
        adepartmentMasterId: 105,
        bdepartmentName: "ITExS",
        cdepartmentCode: "ITE002",
        ddepartmentMasterId: 105,
        edepartmentName: "ITExS",
        fdepartmentCode: "ITE002",
        gdepartmentMasterId: 105,
        hdepartmentName: "ITExS",
        idepartmentCode: "ITE002",
        jdepartmentMasterId: 105,
        kdepartmentName: "ITExS",
        ldepartmentCode: "ITE002",
        mdepartmentMasterId: 105,
        ndepartmentName: "ITExS",
        odepartmentCode: "ITE002",
        pdepartmentMasterId: 105,
        qdepartmentName: "ITExS",
        rdepartmentCode: "ITE002",
        sdepartmentMasterId: 105,
        tdepartmentName: "ITExS",
        udepartmentCode: "ITE002",
      },
    ],
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleChange} />
      <button onClick={handleDecode}>Download Uploaded PDF</button>
      <button onClick={handleDownload}>Download Table Data</button>

      <table border={1} style={{ marginTop: "20px", overflowX: "auto" }}>
        <thead>
          <tr>
            <th>departmentMasterId</th>
            <th>departmentCode</th>
            <th>departmentName</th>
          </tr>
        </thead>
        <tbody>
          {sampledata.departmentNames.map((item, index) => (
            <tr key={index}>
              <td>{item.departmentMasterId}</td>
              <td>{item.departmentCode}</td>
              <td>{item.departmentName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trial;
