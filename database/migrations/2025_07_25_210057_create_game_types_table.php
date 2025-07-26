<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('game_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g. Bingo, Top 10
            $table->string('slug')->unique(); // for routing/api keys
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('game_types');
    }
};
