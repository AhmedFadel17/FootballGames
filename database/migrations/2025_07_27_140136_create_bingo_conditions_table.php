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
        Schema::create('bingo_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bingo_game_id')
                ->constrained('bingo_games')
                ->onDelete('cascade');
            $table->unsignedInteger('object_id');
            $table->string('object_type', 100);
            $table->string('connection_type', 50);
            $table->foreignId('bingo_match_id')
                ->nullable()
                ->constrained('bingo_matches')
                ->nullOnDelete();
            $table->boolean('is_marked')->default(false);
            $table->integer('pos');
            $table->timestamps();

            $table->unique(['bingo_game_id',  'pos'], 'unique_cell_position');
            $table->index(['object_id', 'object_type'], 'bingo_cells_object_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bingo_conditions');
    }
};
