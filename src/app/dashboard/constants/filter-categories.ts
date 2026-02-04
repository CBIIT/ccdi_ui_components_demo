import type { FilterCategory } from "@/components/blocks/filter-sidebar"

export const sampleCategories: FilterCategory[] = [
  {
    id: "diagnosis",
    label: "DIAGNOSIS",
    color: "teal",
    isActive: true,
    children: [
      { id: "abdominal-fibromatosis", label: "Abdominal fibromatosis", count: 8 },
      { id: "acinar-cell-carcinoma", label: "Acinar cell carcinoma", count: 10 },
      { id: "acute-erythroid-leukemia", label: "Acute erythroid leukemia", count: 3 },
      { id: "acute-leukemia-nos", label: "Acute leukemia, NOS", count: 90 },
      { id: "acute-leukemias-ambiguous", label: "Acute Leukemias of Ambiguous Lineage", count: 116 },
      { id: "acute-lymphoblastic-leukemia", label: "Acute Lymphoblastic Leukemia, NOS", count: 1007 },
      { id: "acute-megakaryoblastic-leukemia", label: "Acute megakaryoblastic leukemia", count: 4 },
      { id: "acute-monocytic-leukemia", label: "Acute monocytic leukemia", count: 7 },
    ]
  },
  {
    id: "demographics",
    label: "DEMOGRAPHICS",
    color: "violet",
    children: [
      { id: "age-group-1", label: "0-5 years", count: 234 },
      { id: "age-group-2", label: "6-12 years", count: 456 },
      { id: "age-group-3", label: "13-18 years", count: 789 },
    ]
  },
  {
    id: "treatment",
    label: "TREATMENT",
    color: "orange",
    children: [
      { id: "chemotherapy", label: "Chemotherapy", count: 567 },
      { id: "radiation", label: "Radiation Therapy", count: 234 },
      { id: "surgery", label: "Surgery", count: 345 },
    ]
  },
  {
    id: "treatment-response",
    label: "TREATMENT RESPONSE",
    color: "red",
    children: [
      { id: "complete-response", label: "Complete Response", count: 123 },
      { id: "partial-response", label: "Partial Response", count: 89 },
      { id: "no-response", label: "No Response", count: 45 },
    ]
  },
  {
    id: "survival",
    label: "SURVIVAL",
    color: "blue",
    children: [
      { id: "alive", label: "Alive", count: 678 },
      { id: "deceased", label: "Deceased", count: 234 },
    ]
  },
  {
    id: "samples",
    label: "SAMPLES",
    color: "dark-blue",
    children: [
      { id: "blood-sample", label: "Blood Sample", count: 456 },
      { id: "tissue-sample", label: "Tissue Sample", count: 234 },
      { id: "bone-marrow", label: "Bone Marrow", count: 123 },
    ]
  },
  {
    id: "data-category",
    label: "DATA CATEGORY",
    color: "green",
    children: [
      { id: "clinical-data", label: "Clinical Data", count: 789 },
      { id: "genomic-data", label: "Genomic Data", count: 456 },
      { id: "imaging-data", label: "Imaging Data", count: 234 },
    ]
  },
  {
    id: "study",
    label: "STUDY",
    color: "purple",
    children: [
      { id: "study-1", label: "Study A", count: 123 },
      { id: "study-2", label: "Study B", count: 234 },
      { id: "study-3", label: "Study C", count: 345 },
    ]
  },
  {
    id: "sequencing-library",
    label: "SEQUENCING LIBRARY",
    color: "teal",
    selectedCount: 2,
    children: [
      { id: "rna-seq", label: "RNA-Seq", count: 234 },
      { id: "wgs", label: "Whole Genome Sequencing", count: 123 },
      { id: "wes", label: "Whole Exome Sequencing", count: 89 },
    ]
  }
]
