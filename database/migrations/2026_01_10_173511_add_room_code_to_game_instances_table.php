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
        Schema::table('game_instances', function (Blueprint $table) {
            $table->string('room_code', 10)->nullable()->unique()->after('status');
            $table->foreignId('creator_id')->nullable()->constrained('users')->after('status');
            $table->unsignedInteger('max_players')->default(10)->after('status');
        });
    }
    public function down(): void
    {
        Schema::table('game_instances', function (Blueprint $table) {
            $table->dropForeign(['creator_id']); 
            $table->dropColumn(['room_code', 'creator_id', 'max_players']);
        });
    }
};
