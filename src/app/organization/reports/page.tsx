"use client";

import { useState } from "react";
import {
  FileDown,
  FileText,
  FileSpreadsheet,
  Table,
  Loader2,
} from "lucide-react";
import { ExportFormat, ExportType } from "@/types/organization";
import { generateCSV, generateExcel, generatePDF } from "@/lib/fileGenerators";
import apiClient from "@/lib/apiClient";
import { getCurrentOrganizationId } from "@/utils/organisationUtils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export default function ReportsPage() {
  const [exportConfig, setExportConfig] = useState({
    type: "members" as ExportType,
    format: "csv" as ExportFormat,
    dateFrom: "",
    dateTo: "",
  });
  const [isExporting, setIsExporting] = useState(false);

  const exportTypes = [
    {
      id: "members" as ExportType,
      name: "Members List",
      description: "Export all member data with subscription details",
      icon: Table,
      requiresDateRange: false,
    },
    {
      id: "payments" as ExportType,
      name: "Payment History",
      description: "Export payment transactions and history",
      icon: FileText,
      requiresDateRange: true,
    },
    {
      id: "revenue" as ExportType,
      name: "Revenue Report",
      description: "Export revenue analytics and trends",
      icon: FileSpreadsheet,
      requiresDateRange: true,
    },
    {
      id: "plans" as ExportType,
      name: "Plans Report",
      description: "Export subscription plans and member distribution",
      icon: FileDown,
      requiresDateRange: false,
    },
  ];

  const formats = [
    { id: "csv"   as ExportFormat, name: "CSV",   description: "Comma-separated values" },
    { id: "excel" as ExportFormat, name: "Excel", description: "Microsoft Excel format" },
    { id: "pdf"   as ExportFormat, name: "PDF",   description: "Printable document" },
  ];

  const selectedExportType = exportTypes.find((t) => t.id === exportConfig.type);
  const showDateRange = selectedExportType?.requiresDateRange ?? false;

  const handleExport = async () => {
    if (showDateRange && (!exportConfig.dateFrom || !exportConfig.dateTo)) {
      toast.error("Please select a date range for this report type");
      return;
    }

    setIsExporting(true);
    try {
      const organizationId = getCurrentOrganizationId();
      let response;

      switch (exportConfig.type) {
        case "members":
          response = await apiClient.get(`/analytics/reports/members/${organizationId}`);
          break;
        case "payments":
          response = await apiClient.get(`/analytics/reports/payments/${organizationId}`, {
            params: { startDate: exportConfig.dateFrom, endDate: exportConfig.dateTo },
          });
          break;
        case "revenue":
          response = await apiClient.get(`/analytics/reports/revenue/${organizationId}`, {
            params: { startDate: exportConfig.dateFrom, endDate: exportConfig.dateTo },
          });
          break;
        case "plans":
          response = await apiClient.get(`/analytics/reports/plans/${organizationId}`);
          break;
        default:
          toast.error("Invalid report type");
          return;
      }

      if (response.data.statusCode !== 200) throw new Error("Failed to fetch report data");

      const data = response.data.data;
      const timestamp = new Date().toISOString().split("T")[0];

      let blob: Blob;
      let filename: string;

      switch (exportConfig.format) {
        case "csv":
          blob = generateCSV(data, exportConfig.type);
          filename = `${exportConfig.type}_${timestamp}.csv`;
          break;
        case "excel":
          blob = await generateExcel(data, exportConfig.type);
          filename = `${exportConfig.type}_${timestamp}.xlsx`;
          break;
        case "pdf":
          blob = await generatePDF(data, exportConfig.type);
          filename = `${exportConfig.type}_${timestamp}.pdf`;
          break;
        default:
          throw new Error("Unsupported format");
      }

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Report exported as ${filename}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="font-[Nunito,sans-serif] bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">
            Reports
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
            Reports & Export
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Export your data in various formats
          </p>
        </div>

        {/* ── Main layout: stacks on mobile, 3-col on lg ───────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Left: configuration ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Report Type */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h3 className="text-sm font-bold text-[#0D9488] uppercase tracking-wide mb-4">
                Report Type
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = exportConfig.type === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() =>
                        setExportConfig({
                          ...exportConfig,
                          type: type.id,
                          dateFrom: type.requiresDateRange ? exportConfig.dateFrom : "",
                          dateTo:   type.requiresDateRange ? exportConfig.dateTo   : "",
                        })
                      }
                      className={clsx(
                        "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                        isSelected
                          ? "border-[#0D9488] bg-[#0D9488]/5"
                          : "border-[#E5E7EB] hover:border-[#0D9488]/40"
                      )}
                    >
                      <div className={clsx(
                        "rounded-lg p-2 flex-shrink-0",
                        isSelected ? "bg-[#0D9488]/10" : "bg-[#F9FAFB]"
                      )}>
                        <Icon className={clsx(
                          "h-4 w-4",
                          isSelected ? "text-[#0D9488]" : "text-[#9CA3AF]"
                        )} />
                      </div>
                      <div className="min-w-0">
                        <p className={clsx(
                          "text-sm font-bold",
                          isSelected ? "text-[#0D9488]" : "text-[#1F2937]"
                        )}>
                          {type.name}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range — only shown when required */}
            {showDateRange && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h3 className="text-sm font-bold text-[#0D9488] uppercase tracking-wide mb-4">
                  Date Range <span className="text-red-400">*</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "dateFrom", label: "From", value: exportConfig.dateFrom, key: "dateFrom" as const },
                    { id: "dateTo",   label: "To",   value: exportConfig.dateTo,   key: "dateTo"   as const },
                  ].map(({ id, label, value, key }) => (
                    <div key={id}>
                      <label
                        htmlFor={id}
                        className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2"
                      >
                        {label}
                      </label>
                      <input
                        id={id}
                        type="date"
                        required
                        value={value}
                        onChange={(e) =>
                          setExportConfig({ ...exportConfig, [key]: e.target.value })
                        }
                        className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] focus:border-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Format */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h3 className="text-sm font-bold text-[#0D9488] uppercase tracking-wide mb-4">
                Export Format
              </h3>
              <div className="space-y-2">
                {formats.map((format) => {
                  const isSelected = exportConfig.format === format.id;
                  return (
                    <label
                      key={format.id}
                      className={clsx(
                        "flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all",
                        isSelected
                          ? "border-[#0D9488] bg-[#0D9488]/5"
                          : "border-[#E5E7EB] hover:border-[#0D9488]/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format.id}
                        checked={isSelected}
                        onChange={(e) =>
                          setExportConfig({ ...exportConfig, format: e.target.value as ExportFormat })
                        }
                        className="h-4 w-4 text-[#0D9488] border-[#E5E7EB] focus:ring-[#0D9488]/30 flex-shrink-0"
                      />
                      <div>
                        <p className={clsx(
                          "text-sm font-bold",
                          isSelected ? "text-[#0D9488]" : "text-[#1F2937]"
                        )}>
                          {format.name}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{format.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right: summary + export CTA ──────────────────────────────────
              On mobile this sits below the config. On lg it's sticky sidebar. */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 lg:sticky lg:top-8">
              <h3 className="text-sm font-bold text-[#0D9488] uppercase tracking-wide mb-5">
                Export Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                    Report Type
                  </p>
                  <p className="text-sm font-semibold text-[#1F2937] capitalize">
                    {exportConfig.type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                    Format
                  </p>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {exportConfig.format.toUpperCase()}
                  </p>
                </div>
                {showDateRange && (exportConfig.dateFrom || exportConfig.dateTo) && (
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                      Date Range
                    </p>
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {exportConfig.dateFrom || "Start"} → {exportConfig.dateTo || "Now"}
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Exporting...</>
                  : <><FileDown className="h-4 w-4" /> Export Report</>
                }
              </Button>

              <p className="text-xs text-[#9CA3AF] text-center mt-4 leading-relaxed">
                The report will be downloaded to your device automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}