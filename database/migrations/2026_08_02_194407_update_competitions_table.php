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
        Schema::table('competitions', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('api_id');
            $table->integer('api_id')->nullable()->after('founded_year')->index();
            $table->renameColumn('short_name', 'abbr')->change();
DB::statement('ALTER TABLE competitions ALTER COLUMN type TYPE smallint USING (type::smallint)');        });
    DB::statement('ALTER TABLE competitions DROP CONSTRAINT IF EXISTS competitions_type_check');
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('competitions', function (Blueprint $table) {
            $table->dropColumn('slug');
            $table->dropColumn('api_id');
            $table->renameColumn('abbr', 'short_name');
DB::statement('ALTER TABLE competitions ALTER COLUMN type TYPE varchar USING (type::varchar)');        });
DB::statement("ALTER TABLE competitions ADD CONSTRAINT competitions_type_check CHECK (type IN ('league', 'cup', 'international', 'friendly'))");    
}
};
