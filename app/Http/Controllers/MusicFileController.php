<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMusicFileRequest;
use App\Models\MusicFile;
use Illuminate\Http\JsonResponse;

class MusicFileController extends Controller
{
    public function index(): JsonResponse
    {
        $musicFiles = MusicFile::all();
        return response()->json($musicFiles);
    }

    public function store(StoreMusicFileRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $musicFile = MusicFile::create($data);

        return response()->json($musicFile, 201);
    }

    public function show(MusicFile $musicFile): JsonResponse
    {
        return response()->json($musicFile);
    }

    public function update(StoreMusicFileRequest $request, MusicFile $musicFile): JsonResponse
    {
        $data = $request->validated();
        $musicFile->update($data);

        return response()->json($musicFile);
    }

    public function destroy(MusicFile $musicFile): JsonResponse
    {
        $musicFile->delete();
        return response()->json(null, 204);
    }
}