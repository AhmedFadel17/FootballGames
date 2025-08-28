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
        Schema::create('top_list_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('top_list_item_id')
                ->nullable()
                ->constrained('top_list_items')
                ->onDelete('cascade');
            $table->foreignId('game_entry_id')
                ->constrained('game_entries')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('top_list_answers');
    }
};
