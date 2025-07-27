<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('top10_entries', function (Blueprint $table) {
             $table->id();
            $table->foreignId('game_entry_id')->constrained()->onDelete('cascade');
            $table->json('ordered_player_ids');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('top10_entries');
    }
};
