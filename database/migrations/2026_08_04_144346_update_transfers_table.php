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
        Schema::table('transfers', function (Blueprint $table) {
            $table->renameColumn('fee', 'fee_eur');
            $table->unsignedBigInteger('fee_eur')->change()->nullable();
            $table->tinyInteger('transfer_type')->default(0)->after('fee_eur');
            $table->date('transfer_date')->nullable()->change();
            $table->unsignedBigInteger('to_team_id')->nullable()->change();

            $table->index(['player_id', 'transfer_date']);
            $table->index('fee_eur');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transfers', function (Blueprint $table) {
            $table->dropIndex(['fee_eur']);
            $table->dropIndex(['player_id', 'transfer_date']);

            $table->renameColumn('fee_eur', 'fee');
            $table->date('transfer_date')->nullable(false)->change();
            $table->unsignedBigInteger('to_team_id')->nullable(false)->change();

            $table->decimal('fee', 12, 2)->change()->nullable();
            $table->dropColumn('transfer_type');
        });
    }
};
