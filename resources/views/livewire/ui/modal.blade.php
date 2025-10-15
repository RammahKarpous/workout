<?php

use Livewire\Volt\Component;

new class extends Component {
    public string $name = 'modal';
}; ?>

<div class="bg-background p-4 rounded-lg w-full max-w-2xl border border-border">
    <p class="text-text">{{ $name }}</p>
</div>
