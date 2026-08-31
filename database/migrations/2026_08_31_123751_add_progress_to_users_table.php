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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('points')->default(0)->after('coins');
            $table->unsignedBigInteger('xp')->default(0)->after('points');
            $table->unsignedInteger('level')->default(1)->after('xp');
            $table->unsignedSmallInteger('stamina')->default(100)->after('level');
            $table->unsignedSmallInteger('max_stamina')->default(100)->after('stamina');
            $table->timestamp('last_stamina_update')->nullable()->after('max_stamina');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['points', 'xp', 'level', 'stamina', 'max_stamina', 'last_stamina_update']);
        });
    }
};
