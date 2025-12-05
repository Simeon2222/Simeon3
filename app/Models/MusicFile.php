<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MusicFile extends Model
{
    protected $fillable = ['title', 'filename', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
