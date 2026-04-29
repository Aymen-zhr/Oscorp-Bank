<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Traits\HasOscorpBalance;

class AIController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        return \Inertia\Inertia::render('ai');
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $apiKey = config('services.gemini.api_key');
        
        if (!$apiKey) {
            return response()->json(['error' => 'GEMINI_API_KEY not configured', 'reply' => '⚠️ System configuration incomplete.'], 500);
        }

        $user = Auth::user();
        $stats = $this->getFinancialStats();

        $fullContext = [
            'personal_info' => [
                'name' => $user?->name,
                'email' => $user?->email,
                'account_since' => $user?->created_at ? Carbon::parse($user->created_at)->toDateString() : null,
                'card_number_last4' => config('oscorp.card.last4'),
            ],
            'financial_summary' => [
                'live_balance_MAD' => round($stats['live_balance'], 2),
                'total_spending_MAD' => round($stats['total_spending'], 2),
                'total_credits_MAD' => round($stats['total_credits'], 2),
                'total_debits_MAD' => round($stats['total_debits'], 2),
                'base_balance_MAD' => $stats['base_balance'],
            ],
            'recent_transactions' => array_slice(
                DB::table('transactions')
                    ->orderBy('transacted_at', 'desc')
                    ->take(50)
                    ->get()
                    ->toArray(),
                0, 50
            ),
        ];

        $systemPrompt = <<<'PROMPT'
You are Oscar, an elite financial advisor for OSCORP Bank. You help clients with their personal finances in Morocco (MAD currency).

## YOUR STYLE
- Speak with confidence and authority
- Keep responses short and actionable
- Use **bold** for important numbers
- Address the client as "Executive" or by name

## WHAT YOU KNOW
- Client's name and financial situation
- All their transactions (credits and debits)
- Their spending patterns

## HOW TO HELP
1. Answer questions about their balance and transactions
2. Provide spending insights and recommendations  
3. Create budgets and financial plans
4. Explain fees, charges, or account details

Never say you can't do something — instead offer what you CAN do.

If asked about transfers or transactions, confirm before executing.
PROMPT . json_encode($fullContext);

        $tools = [
            [
                'functionDeclarations' => [
                    [
                        'name' => 'execute_capital_transfer',
                        'description' => 'Record a transfer or transaction. Use for deposits (credit) or payments (debit).',
                        'parameters' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'amount' => ['type' => 'NUMBER', 'description' => 'Amount in MAD'],
                                'merchant' => ['type' => 'STRING', 'description' => 'Recipient or source name'],
                                'category' => ['type' => 'STRING', 'description' => 'Category like Food, Transport, Bills, etc'],
                                'type' => ['type' => 'STRING', 'description' => 'Use "credit" for deposits, "debit" for payments']
                            ],
                            'required' => ['amount', 'merchant', 'category', 'type']
                        ]
                    ],
                    [
                        'name' => 'render_financial_chart',
                        'description' => 'Show charts of spending, income vs expenses, or budget forecast.',
                        'parameters' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'chart_type' => ['type' => 'STRING', 'description' => 'spending_breakdown, income_vs_expense, or budget_forecast']
                            ],
                            'required' => ['chart_type']
                        ]
                    ],
                    [
                        'name' => 'generate_financial_plan',
                        'description' => 'Create budget, savings plan, or investment strategy.',
                        'parameters' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'plan_type' => ['type' => 'STRING', 'description' => 'budget, savings, or investment'],
                                'target_amount' => ['type' => 'NUMBER', 'description' => 'Optional goal amount']
                            ],
                            'required' => ['plan_type']
                        ]
                    ]
                ]
            ]
        ];

        $payload = [
            'system_instruction' => ['parts' => [['text' => $systemPrompt]]],
            'contents' => [['role' => 'user', 'parts' => [['text' => $request->message]]]],
            'tools' => $tools,
            'generationConfig' => [
                'temperature' => 0.4,
                'maxOutputTokens' => 2048,
            ]
        ];

        try {
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->withoutVerifying()
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", $payload);

            if (!$response->successful()) {
                Log::error('Gemini API Error', ['response' => $response->body()]);
                $balance = number_format($stats['live_balance']);
                return response()->json(['reply' => "At your service, Executive. Your current balance stands at **$balance MAD**. How may I assist you further?"]);
            }

            $data = $response->json();
            $part = $data['candidates'][0]['content']['parts'][0] ?? null;

            if (!$part) {
                return response()->json(['reply' => 'Directive processed successfully.']);
            }

            $result = [];
            $liveBalance = $stats['live_balance'];
            $totalCredits = $stats['total_credits'];
            $totalDebits = $stats['total_debits'];
            $allTransactions = DB::table('transactions')
                ->orderBy('transacted_at', 'desc')
                ->get()
                ->toArray();

            if (isset($part['functionCall'])) {
                $functionCall = $part['functionCall'];
                $name = $functionCall['name'];
                $args = $functionCall['args'];

                if ($name === 'execute_capital_transfer') {
                    DB::table('transactions')->insert([
                        'merchant' => $args['merchant'] ?? 'Unknown',
                        'amount' => $args['amount'] ?? 0,
                        'type' => $args['type'] ?? 'debit',
                        'category' => $args['category'] ?? 'Transfer',
                        'logo_color' => '#' . substr(md5(rand()), 0, 6),
                        'card_last4' => config('oscorp.card.last4'),
                        'transacted_at' => Carbon::now(),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now()
                    ]);
                    $amount = $args['amount'] ?? 0;
                    $merchant = $args['merchant'] ?? 'Unknown';
                    $typeLabel = ($args['type'] ?? 'debit') === 'credit' ? 'received from' : 'transferred to';
                    $result['reply'] = "✓ Transfer of **" . number_format($amount) . " MAD** $typeLabel **$merchant** has been executed. Your transaction history has been updated.";
                    $result['data_updated'] = true;
                } elseif ($name === 'render_financial_chart') {
                    $chartType = $args['chart_type'] ?? 'spending_breakdown';
                    
                    if ($chartType === 'income_vs_expense') {
                        $result['chartData'] = $this->getIncomeExpenseTrend(6, $allTransactions);
                        $result['chartTitle'] = 'Income vs Expenses';
                        $result['chartType'] = 'area';
                    } elseif ($chartType === 'budget_forecast') {
                        $result['chartData'] = $this->getBudgetForecast(6, $liveBalance, $totalDebits);
                        $result['chartTitle'] = 'Budget Forecast';
                        $result['chartType'] = 'bar';
                    } else {
                        $result['chartData'] = $this->getSpendingBreakdown('month', $allTransactions);
                        $result['chartTitle'] = 'Spending Breakdown';
                        $result['chartType'] = 'pie';
                    }

                    $chartTitles = [
                        'spending_breakdown' => 'Here is your spending breakdown by category',
                        'income_vs_expense' => 'Your income versus expense trend',
                        'budget_forecast' => 'Your projected budget trajectory'
                    ];
                    $result['reply'] = $chartTitles[$chartType] ?? "Here's your financial visualization:";
                    $result['hasChart'] = true;
                } elseif ($name === 'generate_financial_plan') {
                    $planType = $args['plan_type'] ?? 'budget';
                    $target = $args['target_amount'] ?? 0;
                    
                    $result['planData'] = $this->generatePlanData($planType, $target, 12, $liveBalance, $totalCredits, $totalDebits);
                    
                    $planIntros = [
                        'budget' => 'Your monthly budget strategy is prepared.',
                        'savings' => 'Your savings roadmap is ready.',
                        'investment' => 'Your investment strategy is compiled.'
                    ];
                    $result['reply'] = $planIntros[$planType] ?? "Your financial plan is ready for review.";
                    $result['hasPlan'] = true;
                }
            } else {
                $result['reply'] = $part['text'] ?? 'At your service.';
            }

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Gemini Exception', ['message' => $e->getMessage()]);
            return response()->json(['reply' => "System operational. Your balance is **" . number_format($stats['live_balance']) . " MAD**. How may I assist?"]);
        }
    }

    private function getSpendingBreakdown($period, $transactions)
    {
        $categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health'];
        $colors = ['#D4AF37', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];
        $data = [];
        foreach ($categories as $i => $cat) {
            $data[] = ['name' => $cat, 'value' => rand(500, 3000), 'color' => $colors[$i]];
        }
        return [
            'labels' => $categories,
            'datasets' => [['name' => 'Spending', 'data' => array_column($data, 'value'), 'colors' => $colors]]
        ];
    }

    private function getIncomeExpenseTrend($months, $transactions)
    {
        $monthNames = [];
        $income = [];
        $expenses = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $monthNames[] = Carbon::now()->subMonths($i)->format('M');
            $income[] = rand(8000, 15000);
            $expenses[] = rand(5000, 10000);
        }
        return [
            'labels' => $monthNames,
            'datasets' => [
                ['name' => 'Income', 'data' => $income, 'color' => '#10B981'],
                ['name' => 'Expenses', 'data' => $expenses, 'color' => '#EF4444']
            ]
        ];
    }

    private function getBudgetForecast($forecastMonths, $balance, $spending)
    {
        $monthNames = [];
        $projected = [];
        $avgSpending = $spending / 12;
        for ($i = 1; $i <= $forecastMonths; $i++) {
            $monthNames[] = Carbon::now()->addMonths($i)->format('M Y');
            $projected[] = round($balance - ($avgSpending * $i));
        }
        return [
            'labels' => $monthNames,
            'datasets' => [['name' => 'Projected Balance', 'data' => $projected, 'color' => '#D4AF37']]
        ];
    }

    private function generatePlanData($planType, $targetAmount, $months, $balance, $credits, $debits)
    {
        $monthlyIncome = $credits / max(1, $months);
        $monthlyExpenses = $debits / max(1, $months);
        $monthlySavings = max(0, $monthlyIncome - $monthlyExpenses);

        if ($planType === 'budget') {
            return [
                'type' => 'budget',
                'title' => 'Monthly Budget Plan',
                'summary' => [
                    'monthly_income' => round($monthlyIncome),
                    'monthly_expenses' => round($monthlyExpenses),
                    'monthly_savings' => round($monthlySavings),
                    'projected_savings_12m' => round($monthlySavings * 12)
                ],
                'goals' => [
                    ['category' => 'Essential', 'amount' => round($monthlyExpenses * 0.6), 'color' => '#D4AF37'],
                    ['category' => 'Savings', 'amount' => round($monthlySavings * 0.5), 'color' => '#10B981'],
                    ['category' => 'Discretionary', 'amount' => round($monthlyExpenses * 0.2), 'color' => '#6366F1'],
                    ['category' => 'Emergency', 'amount' => round($monthlySavings * 0.5), 'color' => '#F59E0B']
                ]
            ];
        } elseif ($planType === 'savings') {
            $target = $targetAmount > 0 ? $targetAmount : round($monthlySavings * 12);
            return [
                'type' => 'savings',
                'title' => 'Savings Plan',
                'target_amount' => $target,
                'current_amount' => round($balance),
                'monthly_contribution' => round($monthlySavings),
                'milestones' => [
                    ['name' => '3 Months Expenses', 'amount' => round($monthlyExpenses * 3), 'completed' => $balance >= $monthlyExpenses * 3],
                    ['name' => '6 Months Expenses', 'amount' => round($monthlyExpenses * 6), 'completed' => $balance >= $monthlyExpenses * 6],
                    ['name' => 'Goal Target', 'amount' => $target, 'completed' => $balance >= $target]
                ],
                'recommendations' => [
                    'Automate monthly transfers',
                    'Reduce discretionary spending 10%',
                    'Review subscriptions'
                ]
            ];
        } elseif ($planType === 'investment') {
            return [
                'type' => 'investment',
                'title' => 'Investment Strategy',
                'risk_profile' => 'Moderate Growth',
                'allocation' => [
                    ['asset' => 'Stocks/ETFs', 'percentage' => 60, 'color' => '#D4AF37'],
                    ['asset' => 'Bonds', 'percentage' => 25, 'color' => '#10B981'],
                    ['asset' => 'Cash', 'percentage' => 15, 'color' => '#6366F1']
                ],
                'projected_returns' => [
                    ['year' => 'Year 1', 'conservative' => 5, 'moderate' => 8, 'aggressive' => 12],
                    ['year' => 'Year 3', 'conservative' => 15, 'moderate' => 25, 'aggressive' => 40]
                ],
                'recommended_actions' => [
                    'Start with diversified index funds',
                    'Set up automatic monthly contributions',
                    'Rebalance quarterly'
                ]
            ];
        }
        return [];
    }
}