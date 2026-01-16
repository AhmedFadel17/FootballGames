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
        Schema::create('guess_the_player_game_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guess_the_player_game_id')
                ->constrained('guess_the_player_games')
                ->onDelete('cascade');
            $table->foreignId('game_entry_id')
                ->constrained('game_entries')
                ->onDelete('cascade');
            $table->foreignId('target_player_id')->constrained('players');
            $table->boolean('is_solved')->default(false);
            $table->timestamp('solved_at')->nullable();
            $table->timestamps();
            $table->unique(['game_entry_id'], 'unique_entry_assignment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guess_the_player_game_assignments');
    }
};
