@props(['route'])

<a href="{{ route($route) }}" {{ $attributes->twMerge('inline-block text-white') }}>{{ $slot }}</a>