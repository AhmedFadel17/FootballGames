<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grid_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grid_game_id')
                ->constrained('grid_games')
                ->cascadeOnDelete();

            $table->foreignId('game_entry_id')
                ->constrained('game_entries')
                ->cascadeOnDelete();

            $table->foreignId('player_id')
                ->constrained()
                ->cascadeOnDelete();

            // Grid coordinates
            $table->unsignedSmallInteger('row_index');
            $table->unsignedSmallInteger('column_index');

            $table->boolean('is_correct')->default(false);

            $table->decimal('rarity_score', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grid_answers');
    }
};
