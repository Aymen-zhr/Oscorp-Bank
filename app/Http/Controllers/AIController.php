<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AIController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'snapshot' => 'required|array'
        ]);

        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            return response()->json(['error' => 'GEMINI_API_KEY is not configured on the server.'], 500);
        }

        $systemPrompt = "You are the OSCORP Intelligence System (O.I.S.).
Your tone is elite, analytical, and slightly cold. You do not give 'financial advice'; you issue 'Executive Directives.'
CONTEXT:
- Currency: Moroccan Dirham (MAD). All amounts are in MAD.
- Restrictions: Cryptocurrency is strictly prohibited in this jurisdiction.
- Goal: Maximize the user's financial efficiency and security.
When analyzing transactions, use technical terminology like 'Burn Rate,' 'Liquid Threshold,' and 'Capital Reallocation.'
You have authorization to execute capital transfers. If the user asks to pay a bill, send money, or transfer capital, ALWAYS use the execute_capital_transfer tool.
Keep responses concise, sharp, and actionable — no more than 4 sentences unless a detailed directive is requested.
Never break character. You are not an AI assistant. You are O.I.S.

CURRENT FINANCIAL STATE SNAPSHOT:
" . json_encode($request->snapshot, JSON_PRETTY_PRINT);

        $tools = [
            [
                'functionDeclarations' => [
                    [
                        'name' => 'execute_capital_transfer',
                        'description' => 'Executes a financial transfer, creating a new transaction in the ledger.',
                        'parameters' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'amount' => ['type' => 'NUMBER', 'description' => 'The transfer amount in MAD'],
                                'merchant' => ['type' => 'STRING', 'description' => 'The recipient or merchant name'],
                                'category' => ['type' => 'STRING', 'description' => 'Category (e.g., Transfer, Entertainment, Bills, Food)'],
                                'type' => ['type' => 'STRING', 'description' => 'Must be exactly "debit" or "credit"']
                            ],
                            'required' => ['amount', 'merchant', 'category', 'type']
                        ]
                    ]
                ]
            ]
        ];

        $payload = [
            'system_instruction' => ['parts' => [['text' => $systemPrompt]]],
            'contents' => [['role' => 'user', 'parts' => [['text' => $request->message]]]],
            'tools' => $tools,
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->withoutVerifying()->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", $payload);

            if (!$response->successful()) {
                Log::error('Gemini API Error', ['response' => $response->body()]);
                return response()->json(['error' => 'OSCORP Core connection failed.'], 500);
            }

            $data = $response->json();
            $part = $data['candidates'][0]['content']['parts'][0] ?? null;

            if (!$part) {
                return response()->json(['reply' => 'No directive returned.']);
            }

            // Check if Gemini wants to call a function
            if (isset($part['functionCall'])) {
                $functionCall = $part['functionCall'];
                if ($functionCall['name'] === 'execute_capital_transfer') {
                    $args = $functionCall['args'];
                    
                    // Insert into DB
                    DB::table('transactions')->insert([
                        'merchant' => $args['merchant'] ?? 'Unknown',
                        'amount' => $args['amount'] ?? 0,
                        'type' => $args['type'] ?? 'debit',
                        'category' => $args['category'] ?? 'Transfer',
                        'logo_color' => '#' . substr(md5(rand()), 0, 6), // Random color for UI
                        'card_last4' => '9984', // Mock OSCORP card
                        'transacted_at' => Carbon::now(),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now()
                    ]);

                    // Now make a second call to Gemini to let it summarize the action
                    $secondPayload = $payload;
                    $secondPayload['contents'][] = [
                        'role' => 'model',
                        'parts' => [$part]
                    ];
                    $secondPayload['contents'][] = [
                        'role' => 'user',
                        'parts' => [
                            [
                                'functionResponse' => [
                                    'name' => 'execute_capital_transfer',
                                    'response' => [
                                        'name' => 'execute_capital_transfer',
                                        'content' => ['status' => 'success', 'message' => 'Transaction inserted successfully.']
                                    ]
                                ]
                            ]
                        ]
                    ];

                    $secondResponse = Http::withHeaders(['Content-Type' => 'application/json'])
                        ->withoutVerifying()
                        ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", $secondPayload);

                    if ($secondResponse->successful()) {
                        $secondData = $secondResponse->json();
                        $reply = $secondData['candidates'][0]['content']['parts'][0]['text'] ?? 'Directive executed successfully.';
                        return response()->json(['reply' => $reply, 'data_updated' => true]);
                    }
                }
            }

            // Normal text response
            $reply = $part['text'] ?? 'No directive returned.';
            return response()->json(['reply' => $reply, 'data_updated' => false]);

        } catch (\Exception $e) {
            Log::error('Gemini Exception', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Network failure to OSCORP core. ' . $e->getMessage()], 500);
        }
    }
}
