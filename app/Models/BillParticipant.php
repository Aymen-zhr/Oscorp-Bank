<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillParticipant extends Model
{
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_DECLINED = 'declined';

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_ACCEPTED,
            self::STATUS_DECLINED,
        ];
    }

    protected $table = 'bill_participants';

    protected $fillable = [
        'bill_split_id', 'user_id', 'name', 'phone_number',
        'tag', 'acceptance_status', 'avatar_color', 'share_amount',
        'is_you', 'has_paid', 'partial_paid',
    ];

    protected $casts = [
        'share_amount' => 'decimal:2',
        'partial_paid' => 'decimal:2',
        'is_you' => 'boolean',
        'has_paid' => 'boolean',
    ];

    public function billSplit(): BelongsTo
    {
        return $this->belongsTo(BillSplit::class, 'bill_split_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
