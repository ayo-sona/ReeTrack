import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportType = "members" | "payments" | "revenue" | "plans";

export function generateCSV(data: any, reportType: ExportType): Blob {
  let csvContent = "";

  switch (reportType) {
    case "members":
      // Headers
      csvContent = "Name,Email,Phone,Plan,Status,Join Date,Next Billing\n";

      // Data rows
      data.members?.forEach((member: any) => {
        csvContent += `"${member.name}","${member.email}","${member.phone || ""}","${member.plan}","${member.status}","${member.joinDate}","${member.nextBilling || ""}"\n`;
      });
      break;

    case "payments":
      csvContent = "Date,Member,Amount,Plan,Payment Method,Status,Reference\n";

      data.payments?.forEach((payment: any) => {
        csvContent += `"${payment.date}","${payment.memberName}","${payment.amount}","${payment.plan}","${payment.paymentMethod}","${payment.status}","${payment.reference}"\n`;
      });
      break;

    case "revenue":
      csvContent =
        "Period,Total Revenue,Subscriptions,Average per Member,Growth\n";

      data.revenue?.forEach((item: any) => {
        csvContent += `"${item.period}","${item.totalRevenue}","${item.subscriptions}","${item.averagePerMember}","${item.growth}"\n`;
      });
      break;

    case "plans":
      csvContent =
        "Plan Name,Price,Duration,Active Members,Total Revenue,Status\n";

      data.plans?.forEach((plan: any) => {
        csvContent += `"${plan.name}","${plan.price}","${plan.duration}","${plan.activeMembers}","${plan.totalRevenue}","${plan.status}"\n`;
      });
      break;
  }

  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}

export async function generateExcel(
  data: any,
  reportType: ExportType,
): Promise<Blob> {
  let worksheetData: any[] = [];
  let sheetName = "";

  switch (reportType) {
    case "members":
      sheetName = "Members";
      worksheetData = [
        [
          "Name",
          "Email",
          "Phone",
          "Plan",
          "Status",
          "Join Date",
          "Next Billing",
        ],
        ...(data.members?.map((member: any) => [
          member.name,
          member.email,
          member.phone || "",
          member.plan,
          member.status,
          member.joinDate,
          member.nextBilling || "",
        ]) || []),
      ];
      break;

    case "payments":
      sheetName = "Payments";
      worksheetData = [
        [
          "Date",
          "Member",
          "Amount",
          "Plan",
          "Payment Method",
          "Status",
          "Reference",
        ],
        ...(data.payments?.map((payment: any) => [
          payment.date,
          payment.memberName,
          payment.amount,
          payment.plan,
          payment.paymentMethod,
          payment.status,
          payment.reference,
        ]) || []),
      ];
      break;

    case "revenue":
      sheetName = "Revenue";
      worksheetData = [
        [
          "Period",
          "Total Revenue",
          "Subscriptions",
          "Average per Member",
          "Growth",
        ],
        ...(data.revenue?.map((item: any) => [
          item.period,
          item.totalRevenue,
          item.subscriptions,
          item.averagePerMember,
          item.growth,
        ]) || []),
      ];
      break;

    case "plans":
      sheetName = "Plans";
      worksheetData = [
        [
          "Plan Name",
          "Price",
          "Duration",
          "Active Members",
          "Total Revenue",
          "Status",
        ],
        ...(data.plans?.map((plan: any) => [
          plan.name,
          plan.price,
          plan.duration,
          plan.activeMembers,
          plan.totalRevenue,
          plan.status,
        ]) || []),
      ];
      break;
  }

  // Create workbook and worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export async function generatePDF(
  data: any,
  reportType: ExportType,
): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");

  let title = "";
  let tableData: any[] = [];
  let headers: string[] = [];

  switch (reportType) {
    case "members":
      title = "Members Report";
      headers = ["Name", "Email", "Plan", "Status", "Join Date"];
      tableData =
        data.members?.map((member: any) => [
          member.name,
          member.email,
          member.plan,
          member.status,
          member.joinDate,
        ]) || [];
      break;

    case "payments":
      title = "Payment History";
      headers = ["Date", "Member", "Amount (₦)", "Plan", "Status"];
      tableData =
        data.payments?.map((payment: any) => [
          payment.date,
          payment.memberName,
          payment.amount.toLocaleString(),
          payment.plan,
          payment.status,
        ]) || [];
      break;

    case "revenue":
      title = "Revenue Report";
      headers = [
        "Period",
        "Total Revenue (₦)",
        "Subscriptions",
        "Avg per Member",
        "Growth",
      ];
      tableData =
        data.revenue?.map((item: any) => [
          item.period,
          item.totalRevenue.toLocaleString(),
          item.subscriptions,
          item.averagePerMember.toLocaleString(),
          item.growth,
        ]) || [];
      break;

    case "plans":
      title = "Plans Report";
      headers = [
        "Plan Name",
        "Price (₦)",
        "Duration",
        "Members",
        "Revenue (₦)",
      ];
      tableData =
        data.plans?.map((plan: any) => [
          plan.name,
          plan.price.toLocaleString(),
          plan.duration,
          plan.activeMembers,
          plan.totalRevenue.toLocaleString(),
        ]) || [];
      break;
  }

  // Add title
  doc.text(title, pageWidth / 2, 15, { align: "center" });

  // Add date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateStr = `Generated on ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
  doc.text(dateStr, pageWidth / 2, 22, { align: "center" });

  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 30,
    theme: "grid",
    headStyles: {
      fillColor: [37, 99, 235], // Blue
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Light gray
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    );
  }

  return doc.output("blob");
}
