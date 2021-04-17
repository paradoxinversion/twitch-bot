const Character = require("../db/models/Character");

function monsterHunt() {
  let currentMonster;

  async function createMonster() {
    // test data?
    const monsterData = {
      name: "Typo Dargon 1.1",
      maxHealth: 1,
      currentHealth: 1,
      type: 1,
    };
    const monster = new Character(monsterData);
    await monster.save();
    currentMonster = monster;
    console.log(currentMonster);
  }
  async function getCurrentMonster() {
    if (!currentMonster || currentMonster.currentHealth === 0) {
      const aliveMonster = await Character.findOne({
        type: 1,
        currentHealth: { $gt: 0 },
      });
      console.log("getCurrentMonster::aliveMonster::", aliveMonster);
      if (aliveMonster) {
        currentMonster = aliveMonster;
        return currentMonster;
      }
      await createMonster();
    }
    return currentMonster;
  }

  return {
    getCurrentMonster,
  };
}

module.exports = monsterHunt;
