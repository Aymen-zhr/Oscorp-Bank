<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BillSplit extends Model
{
    const STATUS_ACTIVE = 'active';
    const STATUS_PENDING = 'pending';
    const STATUS_DECLINED = 'declined';
    const STATUS_PAID = 'paid';

    public static function statuses(): array
    {
        return [
            self::STATUS_ACTIVE,
            self::STATUS_PENDING,
            self::STATUS_DECLINED,
            self::STATUS_PAID,
        ];
    }

    protected $table = 'bill_splits';

    protected $fillable = [
        'creator_id', 'title', 'description', 'total_amount',
        'icon', 'logo_color', 'status', 'split_type',
        'due_date', 'is_recurring', 'recurring_period',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'due_date' => 'date',
        'is_recurring' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(BillParticipant::class, 'bill_split_id');
    }
}
