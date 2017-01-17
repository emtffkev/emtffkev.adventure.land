function find_item_filter(filter, search_slot) {
    let slot = search_slot;
    if (!slot)
        slot = 0

    for (let i = slot; i < character.items.length; i++) {
        let item = character.items[i];

        if (item && filter(item))
            return [i, character.items[i]];
    }

    return [-1, null];
}

function purchase_potions(buyHP, buyMP) {
    let [hpslot, hppot] = find_item_filter(i => i.name == hp_potion);
    let [mpslot, mppot] = find_item_filter(i => i.name == mp_potion);

    if (buyHP && (!hppot || hppot.q < pots_minimum)) {
        parent.buy(hp_potion, pots_to_buy);
        set_message("Buying HP pots.");
    }
    if (buyMP && (!mppot || mppot.q < pots_minimum)) {
        parent.buy(mp_potion, pots_to_buy);
        set_message("Buying MP pots.");
    }
}

function loot() {
    var looted = 0;
    if (safeties && mssince(last_loot) < 200) return;
    last_loot = new Date();
    for (id in parent.chests) {
        var chest = parent.chests[id];
        if (safeties && (chest.items > character.esize || chest.last_loot && mssince(chest.last_loot) < 1600)) continue;
        chest.last_loot = last_loot;
        parent.socket.emit("open_chest", {
            id: id
        });
        looted++;
        //if(looted==2) break;
    }
}

//function to find out how many chests are on the ground
function getNumChests() {
    var count = 0;
    for (id in parent.chests) {
        count++;
    }
    return count;
}

// keepSafe - Keep at range during attack
function keepSafe() {
    var target = get_targeted_monster();
    var maxRange = 70;
    var minRange = 70;

    var distance = parent.distance(character,target);

    if (target) {
      change_target(target);

      var diff_x = character.real_x - target.real_x;
      var diff_y = character.real_y - target.real_y;
      angle = Math.atan2(diff_y, diff_x);
    }

    // Comfortable range
    var new_x = target.real_x + character.range * Math.cos(angle);
    var new_y = target.real_y + character.range * Math.sin(angle);

    move(new_x, new_y);

    /*if (distance > maxRange) {
        move(
            character.real_x + (target.real_x - character.real_x) / 2,
            character.real_y + (target.real_y - character.real_y) / 2
        );
    } else if (distance < minRange) {
        move(
            character.real_x - (target.real_x - character.real_x) / 2,
            character.real_y - (target.real_y - character.real_y) / 2
        );
    }*/
}
