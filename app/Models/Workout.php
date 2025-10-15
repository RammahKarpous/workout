<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{
    protected $fillable = [
        'name',
        'description',
        'user_id',
        'temporary_id',
        'muscle_groups',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'muscle_groups' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
