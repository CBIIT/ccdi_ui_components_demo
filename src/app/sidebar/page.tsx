"use client"

import * as React from "react"
import { FilterSidebar, FilterCategory } from "@/components/blocks/filter-sidebar/filter-sidebar"

// Sample data for the filter sidebar
const sampleCategories: FilterCategory[] = [
  {
    id: "diagnosis",
    label: "DIAGNOSIS",
    color: "teal",
    children: [
      {
        id: "item-diagnosis",
        label: "Diagnosis",
        isActive: true,
        searchEnabled: true,
        searchPlaceholder: "e.g. Sarcoma, Neoplasm, phs087...",
        expandedDisplayEnabled: true,
        expandedCount: 546,
        sortEnabled: true,
        options: [
          { id: "abdominal-fibromatosis", label: "Abdominal fibromatosis", count: 19 },
          { id: "acinar-cell-carcinoma", label: "Acinar cell carcinoma", count: 10 }
        ]
      },
      {
        id: "item-diagnosis-category",
        label: "Diagnosis Category",
        searchEnabled: true,
        searchPlaceholder: "e.g. Sarcoma, Neoplasm, phs087...",
        expandedDisplayEnabled: true,
        expandedCount: 85,
        sortEnabled: true,
        options: [
          { id: "acinar-cell-neoplasms", label: "Acinar cell neoplasms", count: 10 },
          { id: "blood-vessel-tumors", label: "Blood vessel tumors", count: 102 }
        ]
      },
      {
        id: "item-diagnosis-anatomic-site",
        label: "Diagnosis Anatomic Site",
        searchEnabled: true,
        expandedCount: 536,
        sortEnabled: true,
        options: [
          { id: "abdomen-nos", label: "Abdomen, NOS", count: 183 },
          { id: "anus-nos", label: "Anus, NOS", count: 2 }
        ]
      },
      {
        id: "item-age-at-diagnosis",
        label: "Age At Diagnosis (Days)",
        ageEnabled: true,
        ageConfig: {
          min: 0,
          max: 26983,
          units: [
            { value: "days", label: "DAYS" },
            { value: "years", label: "YEARS" },
          ]
        }
      },
      {
        id: "item-diagnosis-classification-system",
        label: "Diagnosis Classification System",
        sortEnabled: true,
        options: [
          { id: "icd-o-3.2", label: "ICD-O-3.2", count: 49395 },
          { id: "indication-for-study", label: "Indication for Study", count: 6010 }
        ]
      },
      {
        id: "item-diagnosis-basis",
        label: "Diagnosis Basis",
        sortEnabled: true,
        options: [
          { id: "clinical", label: "Clinical", count: 17136 },
          { id: "molecular", label: "Molecular", count: 39 }
        ]
      },
      {
        id: "item-disease-phase",
        label: "Disease Phase",
        sortEnabled: true,
        options: [
          { id: "initial-diagnosis", label: "Initial Diagnosis", count: 13298 },
          { id: "progression", label: "Progression", count: 369 }
        ]
      }
    ]
  },
  {
    id: "demographics",
    label: "DEMOGRAPHICS",
    color: "violet",
    searchEnabled: true,
    searchPlaceholder: "Participant ID Search",
    uploadEnabled: true,
    uploadLabel: "UPLOAD PARTICIPANTS SET",
    children: [
      {
        id: "item-sex-at-birth",
        label: "Sex At Birth",
        sortEnabled: true,
        options: [
          { id: "female", label: "Female", count: 27510 },
          { id: "male", label: "Male", count: 31853 },
          { id: "not-reported", label: "Not Reported", count: 396 },
          { id: "unknown", label: "Unknown", count: 36 },
        ]
      },
      {
        id: "item-race",
        label: "Race",
        sortEnabled: true,
        options: [
          { id: "american-indian-or-alaskan-native", label: "American Indian or Alaskan Native", count: 342 },
          { id: "asian", label: "Asian", count: 1537 },
          { id: "black-or-african-american", label: "Black or African American", count: 4481 },
          { id: "hispanic-or-latino", label: "Hispanic or Latino", count: 4066 },
          { id: "native-hawaiian-or-other-pacific-islander", label: "Native Hawaiian or Other Pacific Islander", count: 143 },
          { id: "not-allowed-to-collect", label: "Not Allowed to Collect", count: 471 },
          { id: "not-reported", label: "Not Reported", count: 4819 },
          { id: "unknown", label: "Unknown", count: 4115 },
          { id: "white", label: "White", count: 43283 },
          { id: "white-hispanic-or-latino", label: "White, Hispanic or Latino", count: 24 },
        ]
      }
    ]
  },
  {
    id: "treatment",
    label: "TREATMENT",
    color: "orange",
    children: [
      {
        id: "item-age-at-treatment-start",
        label: "Age At Treatment Start",
        ageEnabled: true,
        ageConfig: {
          min: 0,
          max: 16217,
          units: [
            { value: "days", label: "DAYS" },
            { value: "years", label: "YEARS" },
          ]
        }
      },
      {
        id: "item-treatment-agent",
        label: "Treatment Agent",
        sortEnabled: true,
        options: [
          { id: "alemtuzumab", label: "Alemtuzumab", count: 8 },
          { id: "bendamustine", label: "Bendamustine", count: 10 },
          { id: "chlorambucil", label: "Chlorambucil", count: 3 },
          { id: "cyclophosphamide", label: "Cyclophosphamide", count: 90 },
          { id: "fludarabine", label: "Fludarabine", count: 116 },
          { id: "gemcitabine", label: "Gemcitabine", count: 1007 },
          { id: "ibrutinib", label: "Ibrutinib", count: 4 },
        ]
      },
      {
        id: "item-treatment-type",
        label: "Treatment Type",
        sortEnabled: true,
        options: [
          { id: "chemotherapy", label: "Chemotherapy", count: 567 },
          { id: "radiation", label: "Radiation Therapy", count: 234 },
          { id: "surgery", label: "Surgery", count: 345 },
          { id: "immunotherapy", label: "Immunotherapy", count: 345 },
          { id: "hormone-therapy", label: "Hormone Therapy", count: 345 },
          { id: "targeted-therapy", label: "Targeted Therapy", count: 345 },
          { id: "other", label: "Other", count: 345 },
        ]
      },
    ]
  },
  {
    id: "treatment-response",
    label: "TREATMENT RESPONSE",
    color: "red",
    children: [
      {
        id: "item-age-at-response",
        label: "Age At Response",
        ageEnabled: true,
        ageConfig: {
          min: 0,
          max: 9323,
          units: [
            { value: "days", label: "DAYS" },
            { value: "years", label: "YEARS" },
          ]
        }
      },
      {
        id: "item-response-category",
        label: "Response Category",
        sortEnabled: true,
        options: [
          { id: "unknown", label: "Unknown", count: 2246 }
        ]
      },
    ]
  },
  {
    id: "survival",
    label: "SURVIVAL",
    color: "blue",
    children: [
      {
        id: "item-age-at-last-known-survival-status",
        label: "Age At Last Known Survival Status",
        ageEnabled: true,
        ageConfig: {
          min: 0,
          max: 26480,
          units: [
            { value: "days", label: "DAYS" },
            { value: "years", label: "YEARS" },
          ]
        }
      },
      {
        id: "item-first-event",
        label: "First Event",
        sortEnabled: true,
        options: [
          { id: "death", label: "Death", count: 370 },
          { id: "progression", label: "Progression", count: 124 },
          { id: "relapse", label: "Relapse", count: 1820 },
          { id: "second-malignant-neoplasm", label: "Second Malignant Neoplasm", count: 41 }
        ]
      },
      {
        id: "item-last-known-survival-status",
        label: "Last Known Survival Status",
        sortEnabled: true,
        options: [
          { id: "alive", label: "Alive", count: 10012 },
          { id: "dead", label: "Dead", count: 3678 },
          { id: "not-reported", label: "Not Reported", count: 1695 },
          { id: "unknown", label: "Unknown", count: 30902 },
          { id: "unspecified", label: "Unspecified", count: 1 }
        ]
      },
    ]
  },
  {
    id: "samples",
    label: "SAMPLES",
    color: "dark-blue",
    children: [
      {
        id: "item-age-at-collection",
        label: "Age At Collection (Days)",
        ageEnabled: true,
        ageConfig: {
          min: 0,
          max: 26983,
          units: [
            { value: "days", label: "DAYS" },
            { value: "years", label: "YEARS" },
          ]
        }
      },
      {
        id: "item-sample-anatomic-site",
        label: "Sample Anatomic Site",
        searchEnabled: true,
        searchPlaceholder: "e.g. Sarcoma, Neoplasm, phs087...",
        expandedDisplayEnabled: true,
        expandedCount: 378,
        sortEnabled: true,
        options: [
          { id: "abdomen", label: "Abdomen, NOS", count: 87 },
          { id: "chest", label: "Chest", count: 3678 },
          { id: "head-neck", label: "Head & Neck", count: 1695 },
          { id: "bone", label: "Bone", count: 30902 },
          { id: "blood", label: "Blood", count: 1 },
          { id: "other", label: "Other", count: 1 }
        ]
      },
      {
        id: "item-sample-tumor-status",
        label: "Sample Tumor Status",
        sortEnabled: true,
        options: [
          { id: "normal", label: "Normal", count: 23476 },
          { id: "not-reported", label: "Not Reported", count: 234 },
          { id: "tumor", label: "Tumor", count: 16450 }
        ]
      },
      {
        id: "item-tumor-classfication",
        label: "Tumor Classfication",
        sortEnabled: true,
        options: [
          { id: "metastatic", label: "Metastatic", count: 1523 },
          { id: "regional", label: "Regional", count: 318 },
          { id: "primary", label: "Primary", count: 11995 }
        ]
      },
    ]
  },
  {
    id: "data-category",
    label: "DATA CATEGORY",
    color: "green",
    children: [
      {
        id: "item-data-category",
        label: "Data Category",
        sortEnabled: true,
        options: [
          { id: "clinical", label: "Clinical", count: 7014 },
          { id: "genomics", label: "Genomics", count: 5354 },
          { id: "sequencing", label: "Sequencing", count: 15195 }
        ]
      },
      {
        id: "item-file-type",
        label: "File Type",
        sortEnabled: true,
        options: [
          { id: "pdf", label: "pdf", count: 12110 },
          { id: "txt", label: "txt", count: 14892 },
          { id: "xlsx", label: "xlsx", count: 13 },
          { id: "csv", label: "csv", count: 8834 },
          { id: "bai", label: "bai", count: 7032 }
        ]
      },
      {
        id: "item-file-mapping",
        label: "File Mapping",
        sortEnabled: true,
        options: [
          { id: "participant", label: "Participant", count: 8872 },
          { id: "sample", label: "Sample", count: 20669 },
          { id: "study", label: "Study", count: 0 }
        ]
      },
    ]
  },
  {
    id: "study",
    label: "STUDY",
    color: "magenta",
    children: [
      {
        id: "item-dbgap-accession",
        label: "DBGaP Accession",
        sortEnabled: true,
        options: [
          { id: "phs000463", label: "phs000463", count: 233 },
          { id: "phs000464", label: "phs000464", count: 1701 },
          { id: "phs000465", label: "phs000465", count: 2146 }
        ]
      },
      {
        id: "item-study-name",
        label: "Study Name",
        sortEnabled: true,
        options: [
          { id: "ccdi-pediatric", label: "CCDI Pediatric In Vivo Testing Program - Leukemia", count: 40 },
          { id: "ccss", label: "Childhood Cancer Survivor Study", count: 30717 },
          { id: "cmri", label: "Comprehensive Genomic Sequencing of Pediatric Cancer Cases (CMRI/KUCC)", count: 200 }
        ]
      },
      {
        id: "item-study-status",
        label: "Study Status",
        sortEnabled: true,
        options: [
          { id: "active", label: "Active", count: 40092 },
          { id: "completed", label: "Completed", count: 19703 }
        ]
      },
    ]
  },
  {
    id: "sequencing-library",
    label: "SEQUENCING LIBRARY",
    color: "teal",
    // selectedCount: 2,
    children: [
      {
        id: "item-library-selection",
        label: "Library Selection",
        sortEnabled: true,
        options: [
          { id: "cdna", label: "cDNA", count: 457 },
          { id: "hybrid-selection", label: "Hybrid Selection", count: 12580 },
          { id: "pcr", label: "PCR", count: 170 }
        ]
      },
      {
        id: "item-library-source-material",
        label: "Library Source Material",
        sortEnabled: true,
        options: [
          { id: "bulk-cells", label: "Bulk Cells", count: 6506 },
          { id: "bulk-tissue", label: "Bulk Tissue", count: 699 },
          { id: "single-cells", label: "Single Cells", count: 164 }
        ]
      },
      {
        id: "item-library-strategy",
        label: "Library Strategy",
        sortEnabled: true,
        options: [
          { id: "amplicon", label: "AMPLICON", count: 1509 },
          { id: "atac-seq", label: "ATAC-Seq", count: 91 },
          { id: "wga", label: "WGA", count: 4 }
        ]
      },
      {
        id: "item-library-source-molecule",
        label: "Library Source Molecule",
        sortEnabled: true,
        options: [
          { id: "genomic", label: "Genomic", count: 15595 },
          { id: "not-reported", label: "Not Reported", count: 5378 },
          { id: "transcriptomic", label: "Transcriptomic", count: 8796 },
          { id: "viral-rna", label: "Viral RNA", count: 1 }
        ]
      },
    ]
  }
]

export default function Sidebar() {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])

  const handleFilterChange = (filterId: string, isSelected: boolean) => {
    setSelectedFilters(prev => 
      isSelected 
        ? [...prev, filterId]
        : prev.filter(id => id !== filterId)
    )
  }

  const handleClearAll = () => {
    setSelectedFilters([])
  }

  const handleSearch = (query: string) => {
    console.log("Search query:", query)
    // Implement search logic here
  }

  return (
    <div className="h-screen">
      <h1 className="sr-only">Filter Sidebar</h1>
      <FilterSidebar
        categories={sampleCategories}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        onSearch={handleSearch}
      />
    </div>
  );
}
