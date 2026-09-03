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
        Schema::create('bingo_game_instances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_instance_id')
                ->constrained('game_instances')
                ->cascadeOnDelete();

            $table->foreignId('bingo_game_id')
                ->constrained('bingo_games')
                ->cascadeOnDelete();

            $table->integer('remaining_answers')->default(40);
            $table->timestamps();
        });
        Schema::table('bingo_games', function (Blueprint $table) {
            $table->dropForeign(['game_instance_id']);
            $table->dropColumn(['game_instance_id']);
            $table->renameColumn('remaining_answers', 'total_answers');
        });
        Schema::table('bingo_conditions', function (Blueprint $table) {
            $table->dropColumn(['bingo_match_id', 'is_marked']);
        });

        Schema::create('bingo_guesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bingo_game_instance_id')
                ->constrained('bingo_game_instances')
                ->cascadeOnDelete();
            $table->foreignId('game_entry_id')
                ->constrained('game_entries')
                ->cascadeOnDelete();
            $table->foreignId('bingo_match_id')
                ->constrained('bingo_matches')
                ->cascadeOnDelete();
            $table->foreignId('bingo_condition_id')
                ->constrained('bingo_conditions')
                ->cascadeOnDelete();
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bingo_guesses');
        Schema::dropIfExists('bingo_game_instances');
        Schema::table('bingo_conditions', function (Blueprint $table) {
            $table->foreignId('bingo_match_id')->constrained('bingo_matches')->cascadeOnDelete();
            $table->boolean('is_marked')->default(false);
        });
        Schema::table('bingo_games', function (Blueprint $table) {
            $table->dropColumn(['total_answers']);
            $table->renameColumn('total_answers', 'remaining_answers');
            $table->foreignId('game_instance_id')
                ->constrained('game_instances')
                ->cascadeOnDelete();
        });
    }
};
