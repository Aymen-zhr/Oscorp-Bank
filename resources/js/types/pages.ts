export interface Transaction {
    id: number;
    merchant: string;
    amount: number;
    type: 'credit' | 'debit';
    category: string;
    logo_color?: string;
    card_last4?: string;
    transacted_at: string;
    created_at?: string;
    updated_at?: string;
}

export interface AccountUser {
    name: string;
    email: string;
    created_at: string;
    email_verified: boolean;
}

export interface Card {
    number: string;
    full_number: string;
    holder: string;
    expiry: string;
    cvv: string;
    type: string;
    balance: number;
    limit: number;
    available: number;
}

export interface RIB {
    full: string;
    bank_code: string;
    branch_code: string;
    account_number: string;
    rib_key: string;
}

export interface Account {
    number: string;
    type: string;
    opened: string;
    branch: string;
    status: string;
}

export interface AccountStats {
    total_credits: number;
    total_debits: number;
    transaction_count: number;
}

export interface Filters {
    type: string;
    category: string;
    date_from: string;
    date_to: string;
    search: string;
}

export interface DashboardProps {
    balance: number;
    totalSpending: number;
    transactions: Transaction[];
    earningsPercentage: number;
}

export interface TransactionStats {
    balance: number;
    total_credits: number;
    total_debits: number;
}

export interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

export interface TransactionsPageProps {
    transactions: PaginatedTransactions;
    filters: Filters;
    categories: string[];
    stats: TransactionStats;
}

export interface AccountPageProps {
    user: AccountUser;
    card: Card;
    rib: RIB;
    account: Account;
    stats: AccountStats;
    recentTransactions: Transaction[];
}

export interface ChartDataset {
    name: string;
    data: number[];
    color: string;
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

export interface PlanGoal {
    category: string;
    amount: number;
    color: string;
}

export interface PlanSummary {
    monthly_income: number;
    monthly_expenses: number;
    monthly_savings: number;
    projected_savings_12m: number;
}

export interface PlanMilestone {
    name: string;
    amount: number;
    completed: boolean;
}

export interface Allocation {
    asset: string;
    percentage: number;
    color: string;
}

export interface ProjectedReturn {
    year: string;
    conservative: number;
    moderate: number;
    aggressive: number;
}

export interface BudgetPlanData {
    type: 'budget';
    title: string;
    summary: PlanSummary;
    goals: PlanGoal[];
}

export interface SavingsPlanData {
    type: 'savings';
    title: string;
    target_amount: number;
    current_amount: number;
    monthly_contribution: number;
    milestones: PlanMilestone[];
    recommendations: string[];
}

export interface InvestmentPlanData {
    type: 'investment';
    title: string;
    risk_profile: string;
    allocation: Allocation[];
    projected_returns: ProjectedReturn[];
    recommended_actions: string[];
}

export type PlanData = BudgetPlanData | SavingsPlanData | InvestmentPlanData;

export interface AIChatMessage {
    id: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: Date;
    hasChart?: boolean;
    chartType?: 'pie' | 'area' | 'line' | 'bar';
    chartTitle?: string;
    chartData?: ChartData;
    hasPlan?: boolean;
    planData?: PlanData;
}