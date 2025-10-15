<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\Pages\Home;

Route::get('/', Home::class)->name('home');