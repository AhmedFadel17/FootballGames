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
        Schema::create('grid_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grid_game_id')
                ->constrained('grid_games')
                ->cascadeOnDelete();
            $table->unsignedInteger('object_id');
            $table->string('object_type', 100);
            $table->string('connection_type', 50);
            $table->enum('type', ['row', 'column']);
            $table->integer('pos');

            $table->unique(['grid_game_id', 'type', 'pos'], 'unique_grid_cell_position');
            $table->index(['object_id', 'object_type'], 'grid_conditions_object_index');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grid_conditions');
    }
};
