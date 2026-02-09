"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { PeopleIcon } from "@/components/ui/icon";

/** Participant row shape (e.g. for participant tables). */
export interface ParticipantRow {
  participantId: string;
  studyId: string;
  sexAtBirth: string;
  race: string;
  diagnosis: string;
  diagnosisAnatomicSite: string;
  diagnosisCategory: string;
  ageAtDiagnosis?: number | null;
  treatmentType?: string | null;
  lastKnownSurvivalStatus?: string | null;
  badgeCount?: number;
  participantHref?: string;
  anatomicSiteHref?: string;
  categoryHref?: string;
}

/** Matches studyOverview API (e.g. StudyOverViewResult). Use as-is from data.studyOverview. */
export interface StudyRow {
  id: string;
  study_id: string;
  pubmed_id?: string;
  grant_id?: string;
  dbgap_accession: string;
  study_name: string;
  study_status: string;
  personnel_name: string;
  diagnosis: string[];
  anatomic_site: string[];
  num_of_participants: string;
  num_of_samples: string;
  num_of_files: string;
  file_type: string[];
  __typename?: string;
}

/** Matches sampleOverview API (e.g. SampleOverViewResult). Use as-is from data.sampleOverview. */
export interface SampleRow {
  id: string;
  sample_id: string;
  participant_id: string;
  study_id: string;
  anatomic_site: string;
  participant_age_at_collection: number;
  sample_tumor_status: string;
  tumor_classification: string;
  diagnosis: string;
  diagnosis_category: string;
  __typename?: string;
}

/** Matches fileOverview API (e.g. FileOverViewResult). Use as-is from data.fileOverview. */
export interface FileRow {
  id: string;
  file_name: string;
  data_category: string;
  file_description: string;
  file_type: string;
  file_size: string;
  study_id: string;
  participant_id: string;
  sample_id: string;
  file_id: string;
  guid: string;
  md5sum: string;
  library_selection: string | null;
  library_source_material: string | null;
  library_source_molecule: string | null;
  library_strategy: string | null;
  file_access: string;
  file_mapping_level: string;
  __typename?: string;
}

// Helpers for file/display formatting (used by column configs)
function formatFileSize(bytes: string | number | null | undefined): string {
  const num = typeof bytes === "string" ? (bytes ? Number(bytes) : NaN) : bytes;
  if (num == null || Number.isNaN(num) || num === 0) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = num;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}
function stripBrackets(s: string | null | undefined): string {
  if (s == null) return "";
  return s.replace(/^\s*\[/, "").replace(/\]\s*$/, "").trim();
}

// Column configs: one DataTable drives all four tabs; only data and columns change.
export const PARTICIPANT_COLUMNS: DataTableColumn<ParticipantRow>[] = [
  {
    id: "participantId",
    label: "Participant ID",
    fixed: true,
    minWidth: "min-w-[200px]",
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <span className="font-public-sans text-gray-90">{row.participantId}</span>
        {row.badgeCount != null && row.badgeCount > 0 && (
          <span className="relative inline-flex shrink-0">
            <PeopleIcon size="sm" className="text-blue-60v" aria-hidden />
            <span
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-60v px-1 text-[10px] font-bold leading-none text-white"
              aria-hidden
            >
              {row.badgeCount}
            </span>
          </span>
        )}
      </div>
    ),
  },
  { id: "studyId", label: "Study ID", minWidth: "min-w-[120px]" },
  { id: "sexAtBirth", label: "Sex at Birth", minWidth: "min-w-[100px]" },
  { id: "race", label: "Race", minWidth: "min-w-[160px]" },
  { id: "diagnosis", label: "Diagnosis", minWidth: "min-w-[220px]" },
  { id: "diagnosisAnatomicSite", label: "Diagnosis Anatomic Site", minWidth: "min-w-[200px]" },
  { id: "diagnosisCategory", label: "Diagnosis Category", minWidth: "min-w-[140px]" },
  {
    id: "ageAtDiagnosis",
    label: "Age at Diagnosis (days)",
    headerLabel: (
      <>
        <span>Age at Diagnosis</span>
        <span className="text-xs font-normal">(days)</span>
      </>
    ),
    numeric: true,
    minWidth: "min-w-[140px]",
    render: (v) => (v != null ? String(v) : ""),
  },
  { id: "treatmentType", label: "Treatment Type", minWidth: "min-w-[200px]", render: (v) => (v ?? "") as string },
  { id: "lastKnownSurvivalStatus", label: "Last Known Survival Status", minWidth: "min-w-[160px]", render: (v) => (v ?? "") as string },
];

const STUDIES_COLUMNS: DataTableColumn<StudyRow>[] = [
  { id: "study_id", label: "Study ID", fixed: true, minWidth: "min-w-[120px]" },
  { id: "study_name", label: "Study Name", minWidth: "min-w-[220px]" },
  { id: "study_status", label: "Status", minWidth: "min-w-[100px]" },
  { id: "personnel_name", label: "Personnel", minWidth: "min-w-[160px]" },
  {
    id: "diagnosis",
    label: "Diagnosis",
    sortable: false,
    minWidth: "min-w-[120px]",
    accessor: (row) => (row.diagnosis?.length ? row.diagnosis.join(", ") : ""),
  },
  {
    id: "anatomic_site",
    label: "Anatomic Site",
    sortable: false,
    minWidth: "min-w-[140px]",
    accessor: (row) => (row.anatomic_site?.length ? row.anatomic_site.join(", ") : ""),
  },
  {
    id: "num_of_participants",
    label: "Participants",
    numeric: true,
    minWidth: "min-w-[100px]",
    accessor: (row) => (row.num_of_participants != null ? Number(String(row.num_of_participants).replace(/,/g, "")) || 0 : null),
    render: (v) => (v != null && v !== "" ? Number(v).toLocaleString() : ""),
  },
  {
    id: "num_of_samples",
    label: "Samples",
    numeric: true,
    minWidth: "min-w-[90px]",
    accessor: (row) => (row.num_of_samples != null ? Number(String(row.num_of_samples).replace(/,/g, "")) || 0 : null),
    render: (v) => (v != null && v !== "" ? Number(v).toLocaleString() : ""),
  },
  {
    id: "num_of_files",
    label: "Files",
    numeric: true,
    minWidth: "min-w-[90px]",
    accessor: (row) => (row.num_of_files != null ? Number(String(row.num_of_files).replace(/,/g, "")) || 0 : null),
    render: (v) => (v != null && v !== "" ? Number(v).toLocaleString() : ""),
  },
  {
    id: "file_type",
    label: "File Types",
    sortable: false,
    minWidth: "min-w-[100px]",
    accessor: (row) => (row.file_type?.length ? row.file_type.join(", ") : ""),
  },
];

const SAMPLES_COLUMNS: DataTableColumn<SampleRow>[] = [
  { id: "sample_id", label: "Sample ID", fixed: true, minWidth: "min-w-[120px]" },
  { id: "participant_id", label: "Participant ID", minWidth: "min-w-[120px]" },
  { id: "study_id", label: "Study ID", minWidth: "min-w-[110px]" },
  { id: "anatomic_site", label: "Anatomic Site", minWidth: "min-w-[140px]" },
  { id: "participant_age_at_collection", label: "Age at Collection (days)", numeric: true, minWidth: "min-w-[140px]" },
  { id: "sample_tumor_status", label: "Tumor Status", minWidth: "min-w-[100px]" },
  { id: "tumor_classification", label: "Tumor Classification", minWidth: "min-w-[140px]" },
  { id: "diagnosis", label: "Diagnosis", minWidth: "min-w-[120px]" },
  { id: "diagnosis_category", label: "Diagnosis Category", minWidth: "min-w-[140px]" },
];

const FILES_COLUMNS: DataTableColumn<FileRow>[] = [
  { id: "file_name", label: "File Name", fixed: true, minWidth: "min-w-[220px]" },
  { id: "data_category", label: "Data Category", minWidth: "min-w-[140px]", render: (v) => stripBrackets(String(v ?? "")) },
  { id: "file_type", label: "File Type", minWidth: "min-w-[90px]" },
  {
    id: "file_size",
    label: "File Size",
    numeric: true,
    minWidth: "min-w-[100px]",
    accessor: (row) => (row.file_size != null ? Number(row.file_size) || 0 : null),
    render: (v) => formatFileSize(v as string | number | null | undefined),
  },
  { id: "study_id", label: "Study ID", minWidth: "min-w-[110px]" },
  { id: "participant_id", label: "Participant ID", minWidth: "min-w-[180px]", render: (v) => stripBrackets(String(v ?? "")) },
  { id: "sample_id", label: "Sample ID", minWidth: "min-w-[180px]", render: (v) => stripBrackets(String(v ?? "")) },
  { id: "file_access", label: "File Access", minWidth: "min-w-[100px]" },
  { id: "file_mapping_level", label: "Mapping Level", minWidth: "min-w-[120px]" },
  { id: "library_strategy", label: "Library Strategy", minWidth: "min-w-[120px]", render: (v) => (v ?? "") as string },
];

export interface TabbedTableComponentProps {
  participants?: ParticipantRow[];
  studies?: StudyRow[];
  samples?: SampleRow[];
  files?: FileRow[];
  /**
   * Optional display counts for tab labels. Use when showing a subset of data
   * but the tab should display the full total (e.g. "Participants (59,795)").
   * Avoids generating huge arrays that can exceed WebSocket payload limits.
   */
  participantCount?: number;
  studyCount?: number;
  sampleCount?: number;
  fileCount?: number;
  /** Callback when selection changes. Receives tab name and array of selected IDs. */
  onSelectionChange?: (tab: string, selectedIds: string[]) => void;
  className?: string;
}

// Mock data generators
const generateMockParticipants = (count: number): ParticipantRow[] => {
  const sexOptions = ["Male", "Female"];
  const raceOptions = [
    "White",
    "Black or African American",
    "Asian",
    "American Indian or Alaska Native",
    "Native Hawaiian or Other Pacific Islander",
    "Other",
    "Unknown",
  ];
  const diagnosisOptions = [
    "B lymphoblastic leukemia/lymphoma, NOS",
    "T lymphoblastic leukemia/lymphoma",
    "Neuroblastoma, NOS",
    "Nephroblastoma, NOS",
    "Osteosarcoma, NOS",
    "Acute myeloid leukemia, NOS",
    "Medulloblastoma, NOS",
    "Rhabdomyosarcoma, NOS",
  ];
  const anatomicSiteOptions = [
    "C42.1 : Bone marrow",
    "C74.9 : Adrenal gland, NOS",
    "C64.9 : Kidney, NOS",
    "C40.2 : Long bones of lower limb",
    "C71.9 : Brain, NOS",
    "C49.9 : Connective tissue, NOS",
  ];
  const diagnosisCategoryOptions = [
    "Leukemia",
    "Lymphoma",
    "Solid Tumor",
    "Brain Tumor",
    "Sarcoma",
  ];
  const treatmentOptions = [
    "Chemotherapy",
    "Radiation Therapy",
    "Surgery",
    "Immunotherapy",
    "Targeted Therapy",
    null,
  ];
  const survivalStatusOptions = [
    "Alive",
    "Deceased",
    "Lost to Follow-up",
    "Unknown",
    null,
  ];

  return Array.from({ length: count }, (_, i) => ({
    participantId: `PT${String(i + 1).padStart(6, "0")}`,
    studyId: `phs${String(300000 + (i % 10)).padStart(6, "0")}`,
    sexAtBirth: sexOptions[i % sexOptions.length],
    race: raceOptions[i % raceOptions.length],
    diagnosis: diagnosisOptions[i % diagnosisOptions.length],
    diagnosisAnatomicSite: anatomicSiteOptions[i % anatomicSiteOptions.length],
    diagnosisCategory: diagnosisCategoryOptions[i % diagnosisCategoryOptions.length],
    ageAtDiagnosis: i % 5 === 0 ? null : Math.floor(Math.random() * 6570) + 365, // 1-18 years in days
    treatmentType: treatmentOptions[i % treatmentOptions.length],
    lastKnownSurvivalStatus: survivalStatusOptions[i % survivalStatusOptions.length],
    badgeCount: i % 10 === 0 ? Math.floor(Math.random() * 5) + 1 : undefined,
  }));
};

const generateMockStudies = (count: number): StudyRow[] => {
  const statuses = ["Active", "Completed", "Recruiting"];
  const personnel = [
    "Richard Lock, PhD",
    "Greg T Armstrong, MD, MS",
    "Elli Papaemmanuil",
    "Roy Jensen, MD",
    "Rajen Mody, MD",
  ];
  const diagnosisPool = [
    "B lymphoblastic leukemia/lymphoma, NOS (253)",
    "T lymphoblastic leukemia/lymphoma (71)",
    "Neuroblastoma, NOS (487)",
    "Nephroblastoma, NOS (652)",
    "Osteosarcoma, NOS (282)",
  ];
  const anatomicPool = [
    "C42.1 : Bone marrow (324)",
    "C74.9 : Adrenal gland, NOS (87)",
    "C64.9 : Kidney, NOS (652)",
    "C40.2 : Long bones of lower limb and associated joints (148)",
  ];
  const fileTypePool = ["vcf", "bam", "fastq", "txt", "pdf", "tsv", "bai", "cram"];

  return Array.from({ length: count }, (_, i) => {
    const numDiag = 1 + (i % 4);
    const numAnatomic = 1 + (i % 3);
    const numFileTypes = 2 + (i % 5);
    return {
      id: `mock-${i}`,
      study_id: `phs${String(300000 + i).padStart(6, "0")}`,
      pubmed_id: i % 3 === 0 ? `${37169874 + i}` : "",
      grant_id: `CA${199000 + (i % 1000)}`,
      dbgap_accession: `phs${String(300000 + i).padStart(6, "0")}`,
      study_name: `CCDI Pediatric Study ${i + 1} - ${["Leukemia", "Neuroblastoma", "Sarcoma", "Solid Tumors"][i % 4]}`,
      study_status: statuses[i % statuses.length],
      personnel_name: personnel[i % personnel.length],
      diagnosis: diagnosisPool.slice(0, numDiag),
      anatomic_site: anatomicPool.slice(0, numAnatomic),
      num_of_participants: String(Math.floor(Math.random() * 5000) + 40),
      num_of_samples: String(Math.floor(Math.random() * 2000) + 50),
      num_of_files: String(Math.floor(Math.random() * 10000) + 100),
      file_type: fileTypePool.slice(0, numFileTypes),
    };
  });
};

const generateMockSamples = (count: number): SampleRow[] => {
  const tumorStatuses = ["Tumor", "Normal"];
  const tumorClassifications = ["Primary", "Metastatic", "Not Applicable"];
  const anatomicSites = [
    "C76.2 : Abdomen, NOS",
    "C42.0 : Blood",
    "C76.3 : Pelvis, NOS",
    "C40.2 : Long bones of lower limb and associated joints",
    "C41.0 : Bones of skull and face and associated joints",
    "C47 : PERIPHERAL NERVES AND AUTONOMIC NERVOUS SYSTEM",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `mock-sample-${i}`,
    sample_id: `${String((i % 50) + 1).padStart(3, "0")}-${(i % 20) + 1}`,
    participant_id: String((i % 100) + 1),
    study_id: i % 3 === 0 ? "phs003519" : "phs002430",
    anatomic_site: anatomicSites[i % anatomicSites.length],
    participant_age_at_collection: [1461, 4212, 4017, 7305, -999, 6205][i % 6] + (i % 100) * 10,
    sample_tumor_status: tumorStatuses[i % tumorStatuses.length],
    tumor_classification: tumorClassifications[i % tumorClassifications.length],
    diagnosis: "",
    diagnosis_category: "",
  }));
};

const generateMockFiles = (count: number): FileRow[] => {
  const fileTypes = ["dicom", "vcf", "tbi", "csv", "html", "ped", "txt", "tsv", "cram", "crai", "pdf"];
  const dataCategories = ["[Pathology Imaging]", "[Sequencing]", "[Genomics]", "[Transcriptome Profiling]"];
  const libraryStrategies = ["WGS", "RNA-Seq", null];
  const fileAccesses = ["Open", "Controlled"];

  return Array.from({ length: count }, (_, i) => {
    const ext = fileTypes[i % fileTypes.length];
    const fid = `dg.4DFC/${String(1000000 + i).padStart(10, "0")}-${Math.random().toString(36).slice(2, 10)}`;
    return {
      id: fid,
      file_name: `0000${String((i % 9000) + 1000).padStart(4, "0")}-sample.${ext}`,
      data_category: dataCategories[i % dataCategories.length],
      file_description: i % 5 === 0 ? "Annotated Gene Fusion" : "",
      file_type: ext,
      file_size: String(Math.floor(Math.random() * 1e10) + 1e6),
      study_id: i % 3 === 0 ? "phs002517" : i % 3 === 1 ? "phs002790" : "phs001846",
      participant_id: `[PT_${Math.random().toString(36).slice(2, 10).toUpperCase()}]`,
      sample_id: `[BS_${Math.random().toString(36).slice(2, 10).toUpperCase()}]`,
      file_id: fid,
      guid: fid,
      md5sum: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      library_selection: i % 4 === 0 ? null : "Hybrid Selection",
      library_source_material: i % 4 === 0 ? null : "Bulk Cells",
      library_source_molecule: i % 4 === 0 ? null : "Genomic",
      library_strategy: libraryStrategies[i % 3],
      file_access: fileAccesses[i % fileAccesses.length],
      file_mapping_level: "Sample",
    };
  });
};


export function TabbedTableComponent({
  participants = [],
  studies = [],
  samples = [],
  files = [],
  participantCount,
  studyCount,
  sampleCount,
  fileCount,
  onSelectionChange,
  className,
}: TabbedTableComponentProps) {
  const [activeTab, setActiveTab] = React.useState("participants");

  const handleParticipantSelection = React.useCallback(
    (selectedIds: string[]) => {
      onSelectionChange?.("participants", selectedIds);
    },
    [onSelectionChange]
  );

  const handleStudySelection = React.useCallback(
    (selectedIds: string[]) => {
      onSelectionChange?.("studies", selectedIds);
    },
    [onSelectionChange]
  );

  const handleSampleSelection = React.useCallback(
    (selectedIds: string[]) => {
      onSelectionChange?.("samples", selectedIds);
    },
    [onSelectionChange]
  );

  const handleFileSelection = React.useCallback(
    (selectedIds: string[]) => {
      onSelectionChange?.("files", selectedIds);
    },
    [onSelectionChange]
  );

  // Use mock data if not provided (keep counts small to avoid WebSocket payload limits)
  const participantsData = participants.length > 0 ? participants : generateMockParticipants(75);
  const studiesData = studies.length > 0 ? studies : generateMockStudies(40);
  const samplesData = samples.length > 0 ? samples : generateMockSamples(100);
  const filesData = files.length > 0 ? files : generateMockFiles(200);

  // Display count: use override if provided, otherwise use actual data length
  const participantsDisplayCount = participantCount ?? participantsData.length;
  const studiesDisplayCount = studyCount ?? studiesData.length;
  const samplesDisplayCount = sampleCount ?? samplesData.length;
  const filesDisplayCount = fileCount ?? filesData.length;

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="participants">
            Participants ({participantsDisplayCount.toLocaleString()})
          </TabsTrigger>
          <TabsTrigger value="studies">
            Studies ({studiesDisplayCount.toLocaleString()})
          </TabsTrigger>
          <TabsTrigger value="samples">
            Samples ({samplesDisplayCount.toLocaleString()})
          </TabsTrigger>
          <TabsTrigger value="files">
            Files ({filesDisplayCount.toLocaleString()})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="border-0 p-0">
          {participantsData.length > 0 ? (
            <DataTable<ParticipantRow>
              columns={PARTICIPANT_COLUMNS}
              data={participantsData}
              getRowId={(r) => r.participantId}
              filenamePrefix="participants"
              onSelectionChange={handleParticipantSelection}
              idSuffix="-participants"
            />
          ) : (
            <div className="text-center py-8 text-gray-70">No participant data available</div>
          )}
        </TabsContent>

        <TabsContent value="studies" className="border-0 p-0">
          <DataTable<StudyRow>
            columns={STUDIES_COLUMNS}
            data={studiesData}
            getRowId={(r) => r.id}
            filenamePrefix="studies"
            onSelectionChange={handleStudySelection}
            idSuffix="-studies"
          />
        </TabsContent>

        <TabsContent value="samples" className="border-0 p-0">
          <DataTable<SampleRow>
            columns={SAMPLES_COLUMNS}
            data={samplesData}
            getRowId={(r) => r.id}
            filenamePrefix="samples"
            onSelectionChange={handleSampleSelection}
            idSuffix="-samples"
          />
        </TabsContent>

        <TabsContent value="files" className="border-0 p-0">
          <DataTable<FileRow>
            columns={FILES_COLUMNS}
            data={filesData}
            getRowId={(r) => r.id}
            filenamePrefix="files"
            onSelectionChange={handleFileSelection}
            idSuffix="-files"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
