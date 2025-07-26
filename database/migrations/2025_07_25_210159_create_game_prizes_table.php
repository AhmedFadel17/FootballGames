<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('game_prizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_instance_id')->constrained()->onDelete('cascade');
            $table->string('prize_type'); // e.g., 'coins', 'badge', 'item'
            $table->string('description')->nullable();
            $table->unsignedInteger('amount')->nullable(); // e.g. 500 coins
            $table->integer('rank')->nullable(); // e.g. prize for 1st, 2nd, etc.
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('game_prizes');
    }
};

