<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Example of a UUID: '123e4567-e89b-12d3-a456-426614174000'

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('workouts', function (Blueprint $table) {
            $table->id();
            $table->string('temporary_id');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('muscle_groups')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workouts');
    }
};
