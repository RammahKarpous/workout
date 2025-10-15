@props(['label' => '', 'model', 'type' => 'text'])

<div class="form-group flex flex-col gap-2 w-full">
    <label for="{{ $model }}" class="text-text text-sm font-bold">{{ $label }}</label>
    <input type="{{ $type }}" id="{{ $model }}" {{ $attributes->twMerge('w-full p-2 rounded-lg border border-border bg-dark-950 text-text') }} {{ $attributes }} />

    @error($model)
        <p class="text-red-500 text-sm">{{ $message }}</p>
    @enderror
</div>