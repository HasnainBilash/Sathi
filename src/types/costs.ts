export type CostCategory =
  | "ACCOMMODATION"
  | "TRANSPORT"
  | "FOOD"
  | "ACTIVITIES"
  | "OTHER";

export interface CostItem {
  id: string;
  name: string;
  category: CostCategory;
  amount: number; // In BDT (৳)
  isShared: boolean; // true: splits with group; false: per person
  notes?: string;
}

export interface CostSummary {
  totalSoloCost: number;
  perPersonCost: number;
  totalSharedAmount: number;
  sharedPerPerson: number;
  totalIndividualAmount: number;
  savingsPerPerson: number;
  savingsPercent: number;
}
