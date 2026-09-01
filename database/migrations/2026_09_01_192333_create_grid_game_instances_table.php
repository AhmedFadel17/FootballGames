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
        Schema::create('grid_game_instances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_instance_id')
                ->constrained('game_instances')
                ->cascadeOnDelete();

            $table->foreignId('grid_game_id')
                ->constrained('grid_games')
                ->cascadeOnDelete();

            $table->unsignedSmallInteger('max_attempts')->nullable();
            $table->timestamps();
        });

        Schema::table('grid_games', function (Blueprint $table) {
            $table->dropForeign(['game_instance_id']);
            $table->dropColumn('game_instance_id');
        });

        Schema::table('grid_answers', function (Blueprint $table) {
            $table->dropForeign(['grid_game_id']);
            $table->dropColumn('grid_game_id');

            $table->foreignId('grid_game_instance_id')
                ->constrained('grid_game_instances')
                ->cascadeOnDelete();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grid_game_instances');
        Schema::table('grid_games', function (Blueprint $table) {
            $table->foreignId('game_instance_id')
                ->constrained('game_instances')
                ->cascadeOnDelete();
        });

        Schema::table('grid_answers', function (Blueprint $table) {
            $table->dropForeign(['grid_game_instance_id']);
            $table->dropColumn('grid_game_instance_id');

            $table->foreignId('grid_game_id')
                ->constrained('grid_games')
                ->cascadeOnDelete();
        });
    }
};
