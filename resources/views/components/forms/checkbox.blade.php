@props(['label', 'model', 'value'])

<div class="form-group flex items-center gap-2">
    <input type="checkbox" id="{{ $model }}" {{ $attributes->twMerge('w-4 h-4') }} {{ $attributes }} value="{{ $value }}" />
    <label for="{{ $model }}" class="text-text text-sm font-bold">{{ $label }}</label>
</div>