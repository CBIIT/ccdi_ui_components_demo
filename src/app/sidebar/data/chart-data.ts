import type { ChartConfig } from "@/components/charts/chart"

// Pie Chart - Participant distribution by race/ethnicity
export const chartRaceData = [
  { race: "White", participants: 275, fill: "var(--color-navy-60v)" },
  { race: "Black or African American", participants: 200, fill: "var(--color-teal-20)" },
  { race: "Asian", participants: 187, fill: "var(--color-teal-50)" },
  { race: "Hispanic or Latino", participants: 173, fill: "var(--color-indigo-30)" },
  { race: "Other", participants: 90, fill: "var(--color-gray-20)" },
]

export const chartRaceConfig: ChartConfig = {
  participants: {
    label: "Participants",
  },
  White: {
    label: "White",
    color: "var(--color-navy-60v)",
  },
  "Black or African American": {
    label: "Black or African American",
    color: "var(--color-teal-20)",
  },
  Asian: {
    label: "Asian",
    color: "var(--color-teal-50)",
  },
  "Hispanic or Latino": {
    label: "Hispanic or Latino",
    color: "var(--color-indigo-30)",
  },
  Other: {
    label: "Other",
    color: "var(--color-gray-20)",
  },
}

// Line Chart - Monthly enrollment trend
export const chartEnrollmentData = [
  { month: "Jan", participants: 186 },
  { month: "Feb", participants: 305 },
  { month: "Mar", participants: 237 },
  { month: "Apr", participants: 273 },
  { month: "May", participants: 209 },
  { month: "Jun", participants: 214 },
]

export const chartEnrollmentConfig: ChartConfig = {
  participants: {
    label: "Participants Enrolled",
    color: "var(--color-navy-60v)",
  },
}

// Bar Chart - Participants by cancer type
export const chartDiagnosisData = [
  { diagnosisType: "Sarcoma", participants: 1200 },
  { diagnosisType: "Carcinoma", participants: 1900 },
  { diagnosisType: "Leukemia", participants: 3000 },
  { diagnosisType: "Lymphoma", participants: 2100 },
  { diagnosisType: "CNS Tumor", participants: 1800 },
]

export const chartDiagnosisConfig: ChartConfig = {
  participants: {
    label: "Participants",
    color: "var(--color-teal-50)",
  },
}

// Area Chart - Cumulative enrollment over time
export const chartCumulativeData = [
  { week: "Week 1", participants: 400 },
  { week: "Week 2", participants: 700 },
  { week: "Week 3", participants: 1200 },
  { week: "Week 4", participants: 1650 },
  { week: "Week 5", participants: 2250 },
  { week: "Week 6", participants: 2800 },
]

export const chartCumulativeConfig: ChartConfig = {
  participants: {
    label: "Cumulative Participants",
    color: "var(--color-red-50v)",
  },
}

// Horizontal Bar Chart - Participants by age group
export const chartAgeData = [
  { ageGroup: "0–5 years", participants: 512 },
  { ageGroup: "6–12 years", participants: 892 },
  { ageGroup: "13–18 years", participants: 654 },
  { ageGroup: "19–25 years", participants: 445 },
  { ageGroup: "26+ years", participants: 321 },
]

export const chartAgeConfig: ChartConfig = {
  participants: {
    label: "Participants",
    color: "var(--color-golden-10v)",
  },
}

// Composed Chart - Enrollment and specimens by quarter
export const chartStudyData = [
  { quarter: "Q1", participants: 1200, specimens: 300 },
  { quarter: "Q2", participants: 1900, specimens: 450 },
  { quarter: "Q3", participants: 3000, specimens: 600 },
  { quarter: "Q4", participants: 2100, specimens: 550 },
]

export const chartStudyConfig: ChartConfig = {
  participants: {
    label: "Participants Enrolled",
    color: "var(--color-navy-60v)",
  },
  specimens: {
    label: "Specimens Collected",
    color: "var(--color-teal-20)",
  },
}
