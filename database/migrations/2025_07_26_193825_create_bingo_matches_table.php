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
        Schema::create('bingo_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bingo_game_id')
                ->constrained('bingo_games')
                ->onDelete('cascade');
            $table->foreignId('player_id')
                ->constrained('players')
                ->onDelete('cascade');
            $table->integer('pos');
            $table->timestamps();

            $table->unique(['bingo_game_id',  'player_id'], 'unique_player_matches');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bingo_matches');
    }
};
