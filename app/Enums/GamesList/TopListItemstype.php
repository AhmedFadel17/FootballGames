<?php

namespace App\Enums\GamesList;

enum TopListItemstype: string
{
    case PLAYER = "player";
    case TEAM = "team";
    case COUNTRY = "country";
    case CONTINENT = "continent";
    case MANAGER = "manager";
}
