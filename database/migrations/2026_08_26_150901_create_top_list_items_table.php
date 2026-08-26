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
        Schema::create('top_list_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('top_list_game_id')
                ->constrained('top_list_games')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('object_id');
            $table->unsignedSmallInteger('rank');
            $table->string('display_value')->nullable();

            $table->timestamps();
            $table->unique(['top_list_game_id', 'rank'], 'unique_master_game_rank');
            $table->index(['top_list_game_id', 'object_id'], 'top_list_master_lookup_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('top_list_items');
    }
};
