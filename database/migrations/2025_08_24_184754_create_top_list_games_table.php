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
        Schema::create('top_list_games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')
                ->constrained("games")
                ->onDelete('cascade');
            $table->string('items_type', 100);
            $table->string('title');
            $table->integer('max_chances')->default(3);
            $table->integer('size')->default(10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('top_list_games');
    }
};
