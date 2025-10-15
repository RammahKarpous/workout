@props(['label' => '', 'model', 'placeholder' => ''])

<div class="form-group flex flex-col gap-2 w-full">
    <label for="{{ $model }}" class="text-text text-sm font-bold">{{ $label }}</label>
    <textarea 
        name="{{ $model }}" 
        id="{{ $model }}" 
        rows="4" 
        placeholder="{{ $placeholder }}"
        {{ $attributes->twMerge('w-full p-2 rounded-lg border border-border bg-dark-950 text-text resize-vertical') }} {{ $attributes }}></textarea>
</div>