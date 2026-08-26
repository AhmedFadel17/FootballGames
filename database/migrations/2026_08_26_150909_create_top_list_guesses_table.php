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
        Schema::create('top_list_guesses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('top_list_game_instance_id')
                ->constrained('top_list_game_instances')
                ->cascadeOnDelete();

            $table->foreignId('game_entry_id')
                ->constrained('game_entries')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('object_id');
            $table->unsignedTinyInteger('object_type');

            $table->boolean('is_correct')->default(false);
            $table->unsignedSmallInteger('matched_rank')->nullable();

            $table->timestamps();

            $table->unique(
                ['top_list_game_instance_id', 'game_entry_id', 'object_type', 'object_id'],
                'unique_instance_entry_object_guess'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('top_list_guesses');
    }
};
