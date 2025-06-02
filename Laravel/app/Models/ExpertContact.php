<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpertContact extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'preferred_date',
        'expert',
        'service_type',
        'consent',
    ];

    protected $casts = [
        'consent' => 'boolean',
        'preferred_date' => 'date',
    ];
}
