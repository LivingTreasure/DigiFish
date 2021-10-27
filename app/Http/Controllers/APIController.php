<?php

namespace App\Http\Controllers;

use App\Models\PlayerData;
use Illuminate\Http\Request;

class APIController extends Controller
{
    public function setMove(Request $request){
        if ($request->has(['playerX', 'playerY', 'currentScene'])) {
            $moveData = $request->getContent();
            
            $playerData = PlayerData::updateOrCreate(
                [
                    'user_id' => auth()->id()
                ],
                [
                    'user_id' => auth()->id(),
                    'move_data' => $moveData
                ]
            );

            return $request->getContent();
        }
    }

    public function getMove(Request $request) {
        $playerData = auth()->user()->playerData;
        
        if ($playerData != null) {
            return $playerData->move_data;
        } else {
            return '{}';
        }
    }
}
