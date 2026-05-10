<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'description'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public static function get($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? static::castValue($setting->value, $setting->type) : $default;
    }

    public static function set($key, $value, $type = null)
    {
        $setting = static::where('key', $key)->first();

        if (!$setting) {
            return static::create([
                'key' => $key,
                'value' => $value,
                'type' => $type ?? 'string',
            ]);
        }

        $setting->update(['value' => $value]);
        return $setting;
    }

    protected static function castValue($value, $type)
    {
        return match ($type) {
            'boolean' => (bool) $value,
            'numeric' => is_numeric($value) ? $value + 0 : $value,
            default => $value,
        };
    }
}
