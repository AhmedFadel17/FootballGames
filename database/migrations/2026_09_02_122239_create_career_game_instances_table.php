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

        Schema::create('career_game_instances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_instance_id')
                ->constrained('game_instances')
                ->cascadeOnDelete();

            $table->foreignId('career_game_id')
                ->constrained('career_games')
                ->cascadeOnDelete();

            $table->unsignedSmallInteger('revealed_steps')->nullable();
            $table->unsignedSmallInteger('attempts_left')->nullable();
            $table->timestamps();
        });

        Schema::table('career_games', function (Blueprint $table) {
            $table->dropForeign(['game_instance_id']);
            $table->dropColumn(['game_instance_id', 'revealed_steps', 'attempts_left']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('career_game_instances');
        Schema::table('career_games', function (Blueprint $table) {
            $table->foreignId('game_instance_id')
                ->constrained('game_instances')
                ->cascadeOnDelete();

            $table->unsignedSmallInteger('revealed_steps')->nullable();
            $table->unsignedSmallInteger('attempts_left')->nullable();
        });
    }
};
