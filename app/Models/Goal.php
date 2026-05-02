<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Goal extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'icon',
        'target_amount',
        'target_months',
        'monthly_savings',
        'current_savings',
        'start_date',
        'target_date',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'monthly_savings' => 'decimal:2',
        'current_savings' => 'decimal:2',
        'start_date' => 'date',
        'target_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getProgressAttribute(): float
    {
        if ($this->target_amount == 0) return 0;
        return min(100, round(($this->current_savings / $this->target_amount) * 100, 2));
    }

    public function getRemainingAmountAttribute(): float
    {
        return max(0, round($this->target_amount - $this->current_savings, 2));
    }

    public function getIsCompletedAttribute(): bool
    {
        return $this->current_savings >= $this->target_amount;
    }
}
