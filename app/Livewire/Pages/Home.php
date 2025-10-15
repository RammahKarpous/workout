<?php

namespace App\Livewire\Pages;

use Livewire\Component;
use Livewire\Attributes\Layout;

class Home extends Component
{
    #[Layout('layouts.guest')]
    public function render()
    {
        return view('livewire.pages.home');
    }
}
