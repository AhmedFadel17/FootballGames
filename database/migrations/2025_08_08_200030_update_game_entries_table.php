<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{


    public function up(): void
    {
        Schema::table('game_entries', function (Blueprint $table) {
            $table->dropColumn('entry_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_entries', function (Blueprint $table) {
            $table->string('entry_data');
        });
    }
};
