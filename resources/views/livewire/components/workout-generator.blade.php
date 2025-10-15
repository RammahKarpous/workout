<?php

use Livewire\Volt\Component;
use App\Models\Workout;
use Illuminate\Support\Str;

new class extends Component {
    public string $workoutName = '';
    public string $temporaryId = '';
    public string $temporaryWorkoutIds = '';
    public string $workoutDescription = '';
    public array $muscleGroups = [];

    public function generateWorkout()
    {
        $this->temporaryId = Str::random(10);

        $this->validate([
            'workoutName' => 'required',
        ]);

        $this->js("
            let tempIds = JSON.parse(localStorage.getItem('temporary_workout_ids') || '[]');
            const newId = '$this->temporaryId';
            
            if (newId && !tempIds.includes(newId)) {
                tempIds.push(newId);
                localStorage.setItem('temporary_workout_ids', JSON.stringify(tempIds));
            }
        ");

        Workout::create([
            'temporary_id' => $this->temporaryId,
            'name' => $this->workoutName,
            'description' => $this->workoutDescription,
            'muscle_groups' => $this->muscleGroups,
        ]);

        $this->dispatch('get-workout-data');

        $this->workoutDescription = '';
        $this->workoutName = '';
        $this->muscleGroups = [];
    }
}; ?>

<div
	class="workout-generator flex flex-col justify-center w-full max-w-2xl mx-auto bg-background p-4 rounded-lg border border-border">
	<h1 class="text-text text-2xl font-bold mb-4">Workout routine Generator</h1>

	<p class="text-text hidden invisible" data-temporary-id="{{ $temporaryId }}" />

	<form wire:submit="generateWorkout" class="flex flex-col gap-4 w-full">
		<x-forms.input label="Workout Name" model="workoutName" wire:model="workoutName" />
		<x-forms.textarea label="Workout Description (Optional)" model="workoutDescription" wire:model="workoutDescription"
			placeholder="Enter your workout description here" />

		<div class="flex flex-col gap-2">
			<h4 class="text-text text-sm font-bold">Muscle Group(s)</h4>
			
            <div class="flex gap-7 flex-wrap">
				<x-forms.checkbox label="Chest" model="chest" wire:model="muscleGroups" value="chest" />
				<x-forms.checkbox label="Back" model="back" wire:model="muscleGroups" value="back" />
				<x-forms.checkbox label="Shoulders" model="shoulders" wire:model="muscleGroups" value="shoulders" />
				<x-forms.checkbox label="Biceps" model="biceps" wire:model="muscleGroups" value="biceps" />
				<x-forms.checkbox label="Triceps" model="triceps" wire:model="muscleGroups" value="triceps" />
				<x-forms.checkbox label="Legs" model="legs" wire:model="muscleGroups" value="legs" />
				<x-forms.checkbox label="Abs" model="abs" wire:model="muscleGroups" value="abs" />
				<x-forms.checkbox label="Cardio" model="cardio" wire:model="muscleGroups" value="cardio" />
			</div>
		</div>

		<button type="submit" class="dark:bg-blue-800 bg-blue-400 text-text p-2 rounded-lg border border-border">Generate
			Workout Routine</button>
	</form>
</div>
