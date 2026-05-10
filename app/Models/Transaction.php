<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    const STATUS_COMPLETED = 'completed';
    const STATUS_PENDING = 'pending';
    const STATUS_FAILED = 'failed';

    const TYPE_DEBIT = 'debit';
    const TYPE_CREDIT = 'credit';

    public static function statuses(): array
    {
        return [
            self::STATUS_COMPLETED,
            self::STATUS_PENDING,
            self::STATUS_FAILED,
        ];
    }

    public static function types(): array
    {
        return [
            self::TYPE_DEBIT,
            self::TYPE_CREDIT,
        ];
    }

    protected $fillable = [
        'user_id', 'merchant', 'logo_color', 'card_last4',
        'amount', 'type', 'category', 'source', 'note',
        'status', 'transacted_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transacted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
