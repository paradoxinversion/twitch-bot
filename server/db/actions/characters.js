const Character = require("../models/Character");

async function getCharacter(twitchUserId) {
  try {
    return await Character.findOne({ user: twitchUserId });
  } catch (e) {
    console.log(e);
  }
}

async function createCharacter(twitchUserState) {
  try {
    const character = new Character({
      user: twitchUserState["user-id"],
      name: twitchUserState["display-name"],
    });
    await character.save();
    return character;
  } catch (e) {
    console.log(e);
  }
}

async function increaseHealth(twitchUserId, amt) {
  try {
    const character = await getCharacter(twitchUserId);
    character.currentHealth += amt;
    if (character.currentHealth > character.maxHealth)
      character.currentHealth = character.maxHealth;
    await character.save();
  } catch (e) {
    console.log(e);
  }
}

async function decreaseHealth(twitchUserId, amt) {
  try {
    const character = await getCharacter(twitchUserId);
    character.currentHealth -= amt;
    if (character.currentHealth < 0) character.currentHealth = 0;
    await character.save();
    return character.currentHealth;
  } catch (e) {
    console.log(e);
  }
}

async function decreaseMonsterHealth(monsterId, amt) {
  try {
    const monster = await Character.findById(monsterId);
    monster.currentHealth -= amt;
    if (monster.currentHealth < 0) monster.currentHealth = 0;
    await monster.save();
    return monster.currentHealth;
  } catch (e) {
    console.log(e);
  }
}

// isCharacterDead(id)

// setCharacterHealth(id)

// killCharacter(id) // increment deaths

module.exports = {
  getCharacter,
  createCharacter,
  increaseHealth,
  decreaseHealth,
  decreaseMonsterHealth,
};
