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
        Schema::create('top_list_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('top_list_game_id')
                ->constrained('top_list_games')
                ->onDelete('cascade');
            $table->integer('pos');
            $table->unsignedInteger('object_id');
            $table->timestamps();
            $table->unique(['top_list_game_id',  'object_id','pos'], 'unique_cell_id');
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
