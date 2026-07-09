export type User = {
  id: number;
  name: string;
  email: string;
};

export type Category = {
  id: number;
  name: string;
  type: "income" | "expense";
};

export type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  transaction_date: string;
  category_id: number;
  category_name?: string;
};

export type Budget = {
  id: number;
  category_id: number;
  category_name: string;
  monthly_limit: number;
};