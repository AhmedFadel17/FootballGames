<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         User::create([
            'first_name' => 'Ahmed',
            'last_name'  => 'Fadel',
            'username'   => "Admin_Fadel",
            'email'      => "admin@fg.com",
            'password'   => "Admin_15",
            'role'       => 'admin',
        ]);
    }
}
