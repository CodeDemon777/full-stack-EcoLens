import { ChangeEvent, useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  Download,
  FileSpreadsheet,
  Leaf,
  Loader2,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

import { API_BASE } from "@/lib/api";

const REQUIRED_COLUMNS = [
  "electricity_kwh",
  "fuel_liters",
  "transport_km",
  "waste_kg",
  "employee_count",
] as const;

type PreviewRow = Record<string, string>;

type CategoryBreakdown = {
  category: string;
  label: string;
  emissions: number;
  share: number;
  color: string;
};

type IntensityMetric = {
  label: string;
  value: number;
};

type Insight = {
  title: string;
  summary: string;
  priority: string;
};

type Recommendation = {
  title: string;
  category: string;
  impact: string;
  description: string;
};

type AnalyzerReport = {
  summary: string;
  key_contributors: string[];
  recommendations: string[];
  narrative: string;
};

type AnalyzerResponse = {
  file_name: string;
  rows_processed: number;
  required_fields: string[];
  activity_totals: Record<string, number>;
  total_emissions: number;
  unit: string;
  confidence_score: number;
  emissions_per_employee: number;
  category_breakdown: CategoryBreakdown[];
  intensity_metrics: IntensityMetric[];
  key_contributors: string[];
  insights: Insight[];
  recommendations: Recommendation[];
  report: AnalyzerReport;
};

type PreviewState = {
  fileName: string;
  rowCount: number;
  sampleRows: PreviewRow[];
  missingColumns: string[];
  invalidRows: number[];
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const normalizeRow = (row: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.trim().toLowerCase(),
      String(value ?? "").trim(),
    ]),
  ) as PreviewRow;

const parsePreview = (file: File) =>
  new Promise<PreviewState>((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map(normalizeRow);
        const fields = (results.meta.fields ?? []).map((field) => field.trim().toLowerCase());
        const missingColumns = REQUIRED_COLUMNS.filter((column) => !fields.includes(column));
        const invalidRows: number[] = [];

        rows.forEach((row, index) => {
          const hasInvalidValue = REQUIRED_COLUMNS.some((column) => {
            const value = row[column];
            const numericValue = Number(value);
            if (value === "" || Number.isNaN(numericValue) || numericValue < 0) {
              return true;
            }
            if (column === "employee_count" && numericValue <= 0) {
              return true;
            }
            return false;
          });

          if (hasInvalidValue) {
            invalidRows.push(index + 2);
          }
        });

        resolve({
          fileName: file.name,
          rowCount: rows.length,
          sampleRows: rows.slice(0, 5),
          missingColumns,
          invalidRows,
        });
      },
      error: (error) => reject(error),
    });
  });

const OrganizationAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzerResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAnalysis(null);
    setSelectedFile(null);
    setPreview(null);
    setFileError("");

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Please upload a CSV file.");
      return;
    }

    try {
      const previewState = await parsePreview(file);
      if (previewState.rowCount === 0) {
        setFileError("The uploaded CSV has no data rows.");
        return;
      }

      if (previewState.missingColumns.length > 0) {
        setFileError(`Missing required columns: ${previewState.missingColumns.join(", ")}`);
        setPreview(previewState);
        return;
      }

      if (previewState.invalidRows.length > 0) {
        const sampleRows = previewState.invalidRows.slice(0, 5).join(", ");
        setFileError(`Found invalid numeric values in rows: ${sampleRows}`);
        setPreview(previewState);
        return;
      }

      setSelectedFile(file);
      setPreview(previewState);
      toast.success("CSV validated and ready for analysis.");
    } catch (error) {
      console.error(error);
      setFileError("Failed to parse the CSV file.");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setFileError("Upload a valid CSV file before running analysis.");
      return;
    }

    setIsAnalyzing(true);
    setFileError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE}/organization-analyzer/upload`, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || "The backend could not process the CSV file.");
      }

      setAnalysis(payload.data as AnalyzerResponse);
      toast.success("Organizational footprint analysis complete.");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to connect to backend.";
      setFileError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) {
      return;
    }

    const categoryRows = analysis.category_breakdown
      .map(
        (item) =>
          `<tr><td>${item.label}</td><td>${item.emissions.toFixed(2)} ${analysis.unit}</td><td>${item.share.toFixed(1)}%</td></tr>`,
      )
      .join("");

    const recommendationItems = analysis.recommendations
      .map((item) => `<li><strong>${item.title}</strong>: ${item.description}</li>`)
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Organizational Carbon Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; }
            h1, h2 { color: #111827; }
            .meta { color: #6b7280; margin-bottom: 24px; }
            .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
            .metric { border: 1px solid #d1d5db; border-radius: 12px; padding: 16px; }
            .metric-label { font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
            .metric-value { font-size: 24px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background: #f3f4f6; }
            ul { padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>AI-Based Carbon Footprint Analyzer for Organizations</h1>
          <p class="meta">Source file: ${analysis.file_name} | Records processed: ${analysis.rows_processed}</p>
          <p>${analysis.report.summary}</p>
          <div class="metric-grid">
            <div class="metric">
              <div class="metric-label">Total Emissions</div>
              <div class="metric-value">${analysis.total_emissions.toFixed(2)} ${analysis.unit}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Emissions / Employee</div>
              <div class="metric-value">${analysis.emissions_per_employee.toFixed(2)}</div>
            </div>
            <div class="metric">
              <div class="metric-label">AI Confidence</div>
              <div class="metric-value">${Math.round(analysis.confidence_score * 100)}%</div>
            </div>
          </div>
          <h2>Emission Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Emissions</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>${categoryRows}</tbody>
          </table>
          <h2>Key Contributors</h2>
          <p>${analysis.report.key_contributors.join(", ")}</p>
          <h2>Recommendations</h2>
          <ul>${recommendationItems}</ul>
          <h2>AI Narrative</h2>
          <p>${analysis.report.narrative}</p>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "organization-carbon-report.html";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            AI-Based Carbon Footprint Analyzer
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload operational CSV data to estimate organizational emissions, visualize hotspots, and generate reduction guidance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/examples/organization-activity-sample.csv"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download sample CSV
          </a>
          <button
            onClick={downloadReport}
            disabled={!analysis}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                CSV Upload
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
                Upload organizational activity data
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Required fields: {REQUIRED_COLUMNS.join(", ")}. Extra columns are allowed and will be ignored.
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-primary">
              <Upload className="h-5 w-5" />
            </div>
          </div>

          <label className="mt-6 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-primary/5">
            <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            <div>
              <p className="font-medium text-foreground">Choose a CSV file</p>
              <p className="mt-1 text-sm text-muted-foreground">Client-side validation runs before upload.</p>
            </div>
          </label>

          {preview && (
            <div className="mt-6 rounded-2xl border border-border bg-background p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">{preview.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {preview.rowCount} data rows ready for analysis
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {preview.missingColumns.length === 0 && preview.invalidRows.length === 0
                    ? "Validation passed"
                    : "Validation issue detected"}
                </div>
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {REQUIRED_COLUMNS.map((column) => (
                        <th key={column} className="px-4 py-3 text-left font-medium text-foreground">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.sampleRows.map((row, index) => (
                      <tr key={`${preview.fileName}-${index}`} className="border-t border-border">
                        {REQUIRED_COLUMNS.map((column) => (
                          <td key={column} className="px-4 py-3 text-muted-foreground">
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {fileError && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {fileError}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running AI analysis...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze organization footprint
              </>
            )}
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Workflow
          </p>
          <div className="mt-4 space-y-4">
            {[
              {
                title: "1. Upload",
                copy: "Import departmental, site, or monthly activity data using the required CSV structure.",
              },
              {
                title: "2. Validate",
                copy: "PapaParse checks headers and numeric values before the file is sent to Flask.",
              },
              {
                title: "3. Estimate",
                copy: "The backend aggregates the data, estimates total emissions, and scales category outputs.",
              },
              {
                title: "4. Act",
                copy: "Review charts, identify contributors, and export a short report for stakeholders.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-background p-4">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-3">
              <Leaf className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">AI-generated sustainability guidance</p>
                <p className="text-sm text-muted-foreground">
                  Recommendations are ranked against your uploaded emission profile, not a generic static template.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {analysis && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Total emissions
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-foreground">
                {formatNumber(analysis.total_emissions)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{analysis.unit}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Emissions / employee
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-foreground">
                {formatNumber(analysis.emissions_per_employee)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">tCO2e per employee</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Records processed
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-foreground">
                {formatNumber(analysis.rows_processed)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{analysis.file_name}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                AI confidence
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-foreground">
                {Math.round(analysis.confidence_score * 100)}%
              </p>
              <p className="mt-1 text-sm text-muted-foreground">ensemble estimate stability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Emissions by category
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Chart-ready breakdown of the analyzed organization footprint.
                  </p>
                </div>
              </div>
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.category_breakdown} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="label" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(2)} ${analysis.unit}`, "Emissions"]} />
                    <Bar dataKey="emissions" radius={[0, 10, 10, 0]}>
                      {analysis.category_breakdown.map((entry) => (
                        <Cell key={entry.category} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Share of total emissions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Largest categories become your fastest reduction levers.
                </p>
              </div>
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.category_breakdown}
                      dataKey="emissions"
                      nameKey="label"
                      innerRadius={72}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {analysis.category_breakdown.map((entry) => (
                        <Cell key={entry.category} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toFixed(2)} ${analysis.unit}`, "Emissions"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {analysis.category_breakdown.map((item) => (
                  <div key={item.category} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{item.share}%</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-foreground">Intensity metrics</h2>
              <p className="text-sm text-muted-foreground">
                Operational intensity benchmarks derived from the uploaded CSV.
              </p>
              <div className="mt-6 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.intensity_metrics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatNumber(value)} />
                    <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid gap-3">
                {Object.entries(analysis.activity_totals).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                    <span className="text-sm text-muted-foreground">{key}</span>
                    <span className="text-sm font-medium text-foreground">{formatCompact(value)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      AI-generated insights
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Narrative output based on emission profile and intensity signals.
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {analysis.insights.map((item) => (
                    <div key={item.title} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
                          {item.priority}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Sustainability recommendations
                </h2>
                <p className="text-sm text-muted-foreground">
                  Highest-leverage actions inferred from the uploaded operational profile.
                </p>
                <div className="mt-5 space-y-3">
                  {analysis.recommendations.map((item) => (
                    <div key={item.title} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                          {item.category}
                        </span>
                        <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary">
                          {item.impact} impact
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Carbon footprint summary report
                </h2>
                <p className="text-sm text-muted-foreground">
                  A concise report block ready for export or stakeholder review.
                </p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
                Top contributors: {analysis.key_contributors.join(", ")}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-xl border border-border bg-background p-5 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Summary
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {analysis.report.summary}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {analysis.report.narrative}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Key contributors
                </p>
                <ul className="mt-3 space-y-2">
                  {analysis.report.key_contributors.map((item) => (
                    <li key={item} className="text-sm text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Recommended next actions
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {analysis.report.recommendations.map((item) => (
                  <li key={item} className="rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default OrganizationAnalyzer;
