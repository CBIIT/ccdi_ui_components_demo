/* Types for filter categories (matches sampleCategories in sidebar/page.tsx) */
// Use FilterOptionValue for checkbox rows; FilterFacet for accordion subsections; FilterCategory for the main categories.
export type FilterOptionValue = {
  id: string;
  label: string;
  count: number;
}

export type FilterFacet = {
  id: string;
  label: string;
  isActive?: boolean;
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  expandedDisplayEnabled?: boolean;
  expandedCount?: number;
  sortEnabled?: boolean;
  ageEnabled?: boolean;
  ageConfig?: {
    min: number;
    max: number;
    units: { value: string; label: string }[];
  };
  options?: FilterOptionValue[];
}

export type FilterCategory = {
  id: string;
  label: string;
  color: string;
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  uploadEnabled?: boolean;
  uploadLabel?: string;
  children?: FilterFacet[];
}
