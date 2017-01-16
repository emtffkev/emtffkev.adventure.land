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

function loot()
{
	var looted=0;
	if(safeties && mssince(last_loot)<200) return;
	last_loot=new Date();
	for(id in parent.chests)
	{
		var chest=parent.chests[id];
		if(safeties && (chest.items>character.esize || chest.last_loot && mssince(chest.last_loot)<1600)) continue;
		chest.last_loot=last_loot;
		parent.socket.emit("open_chest",{id:id});
		looted++;
		//if(looted==2) break;
	}
}

//function to find out how many chests are on the ground
function getNumChests()
{
    var count = 0;
    for(id in parent.chests)
    {
        count++;
    }
    return count;
}
