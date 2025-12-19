<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AsteroidController extends Controller
{
    public function index(Request $request, $target = null)
    {
        $target = $target ?? $request->query('target', 'J99TS7A');

        try {
            $response = Http::timeout(30)
                ->withOptions(['verify' => false]) // Disable SSL verification for development
                ->get(
                    'https://www.asterank.com/api/skymorph/search',
                    ['target' => $target]
                );

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch data from Asterank SkyMorph',
                ], 502);
            }

            $data = $response->json();

            if (!is_array($data)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unexpected response format from SkyMorph',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'target'  => $target,
                'data'    => $data,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error in AsteroidController',
                'error'   => app()->environment('production') ? null : $e->getMessage(),
            ], 500);
        }
    }
}
