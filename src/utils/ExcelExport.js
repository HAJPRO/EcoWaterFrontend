// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export async function  ExcelExportOrdersByCustomer(data) {
//         if (!Array.isArray(data) || data.length === 0) {
//           console.warn("orders is not an array or empty");
//           return;
//         }
      
//         const workbook = new ExcelJS.Workbook();
//         const firstOrder = data[0]; // firstOrder oldin aniqlansin
      
//         // Worksheet nomi: agar customer mavjud bo'lsa, ularni F.I.Sh. aks ettirilsin, aks holda "Buyurtmalar"
//         const worksheet = workbook.addWorksheet(
//           `${firstOrder?.customerId?.fullname || "Buyurtmalar"}`
//         );
      
//         const customerName = firstOrder?.customerId?.fullname || "Mijoz";
//         const {
//           region = "",
//           district = "",
//           street = "",
//         } = firstOrder?.customerId?.address || {};
//         const addressString = [region, district, street].filter(Boolean).join(", ");
      
//         const headers = [
//           "№", // Tartib raqam
//           "Buyurtma №",
//           "Holati",
//           "Haydovchi",
//           "Buyurtma vaqti",
//           "Yetkazilgan vaqti",
//           "Mahsulot nomi",
//           "Miqdor",
//           "Birlik",
//           "Narx",
//           "Summasi",
//         ];
      
//         const getColumnLetter = (colNum) => {
//           let letter = "";
//           while (colNum > 0) {
//             let remainder = (colNum - 1) % 26;
//             letter = String.fromCharCode(65 + remainder) + letter;
//             colNum = Math.floor((colNum - 1) / 26);
//           }
//           return letter;
//         };
      
//         const lastColLetter = getColumnLetter(headers.length);
//         const titleRange = `A1:${lastColLetter}1`;
      
//         // 1-satr: Sarlavha
//         worksheet.addRow([
//           `${customerName} (${addressString}) ning buyurtmalar ro'yxati`,
//         ]);
//         worksheet.mergeCells(titleRange);
//         worksheet.getCell("A1").font = { bold: true, size: 16 };
//         worksheet.getCell("A1").alignment = {
//           vertical: "middle",
//           horizontal: "center",
//         };
//         worksheet.getRow(1).height = 30;
      
//         // 2-satr: Header
//         worksheet.addRow(headers);
//         const headerRow = worksheet.getRow(2);
//         headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
//         headerRow.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FF16A34A" }, // green-600
//         };
//         headerRow.alignment = { vertical: "middle", horizontal: "center" };
//         headerRow.height = 25;
      
//         let grandTotal = 0;
//         let rowNumber = 4;
      
//         data.forEach((order) => {
//           const driver = order.driverId || {};
//           const products = Array.isArray(order.products) ? order.products : [];
      
//           const validProducts = products.filter(
//             (p) => typeof p === "object" && !Array.isArray(p) && p !== null
//           );
      
//           if (validProducts.length === 0) {
//             worksheet.addRow([
//               rowNumber++,
//               order.orderNumber || "",
//               order.status || "",
//               driver.fullname || "",
//               new Date(order.createdAt).toLocaleString(),
//               new Date(order.deliveryTime).toLocaleString(),
//               "",
//               "",
//               "",
//               "",
//               "",
//             ]);
//           } else {
//             validProducts.forEach((product, index) => {
//               worksheet.addRow([
//                 index === 0 ? rowNumber : "",
//                 index === 0 ? order.orderNumber || "" : "",
//                 index === 0 ? order.status || "" : "",
//                 index === 0 ? driver.fullname || "" : "",
//                 index === 0 ? new Date(order.createdAt).toLocaleString() : "",
//                 index === 0 ? new Date(order.deliveryTime).toLocaleString() : "",
//                 product.pro_name || product.title || "",
//                 product.pro_quantity || "",
//                 product.pro_unit || "",
//                 product.pro_price || "",
//                 product.pro_total_price || "",
//               ]);
//             });
      
//             const total = validProducts.reduce(
//               (sum, p) => sum + (p.pro_total_price || 0),
//               0
//             );
      
//             grandTotal += total;
      
//             const totalRow = worksheet.addRow([
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               "➡ Buyurtma summasi:",
//               total,
//             ]);
//             totalRow.font = { bold: true };
      
//             rowNumber++;
//           }
//         });
      
//         const finalRow = worksheet.addRow([
//           "",
//           "",
//           "",
//           "",
//           "",
//           "",
//           "",
//           "",
//           "",
//           "🧾 Umumiy summa:",
//           grandTotal,
//         ]);
//         finalRow.font = { bold: true };
//         finalRow.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFFFCC00" }, // sariq
//         };
      
//         const colWidths = [6, 20, 15, 25, 25, 25, 30, 12, 12, 15, 18];
//         colWidths.forEach((width, i) => {
//           worksheet.getColumn(i + 1).width = width;
//         });
      
//         // HAR BIR KATAKCHAGA CHEGARA
//         worksheet.eachRow({ includeEmpty: false }, (row) => {
//           row.eachCell({ includeEmpty: false }, (cell) => {
//             cell.border = {
//               top: { style: "thin" },
//               left: { style: "thin" },
//               bottom: { style: "thin" },
//               right: { style: "thin" },
//             };
//           });
//         });
      
//         const buffer = await workbook.xlsx.writeBuffer();
//         const blob = new Blob([buffer], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });
//         saveAs(blob, "buyurtmalar.xlsx");
    
// }
