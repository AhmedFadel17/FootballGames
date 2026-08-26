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
        Schema::create('top_list_game_instances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('game_instance_id')
                ->constrained('game_instances')
                ->cascadeOnDelete();

            $table->foreignId('top_list_game_id')
                ->constrained('top_list_games')
                ->cascadeOnDelete();

            $table->unsignedSmallInteger('max_attempts')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('top_list_game_instances');
    }
};
