<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'type',
        'details',
        'surface',
        'status',
        'images'
    ];

    protected $casts = [
        'images' => 'array'
    ];


}