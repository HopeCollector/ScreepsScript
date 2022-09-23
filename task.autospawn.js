const { all } = require("lodash");

let bodypart_cost = {
  [MOVE]: 50,
  [WORK]: 100,
  [CARRY]: 50,
  [ATTACK]: 80,
  [RANGED_ATTACK]: 150,
  [HEAL]: 250,
  [CLAIM]: 600,
  [TOUGH]: 10
};

class body_base {
  constructor(blue_print) {
    this.blue_print = blue_print;
  }

  cost() {
    var ret = 0;
    for (var part of this.blue_print) {
      ret += bodypart_cost[part];
    }
    return ret;
  }
};

var taskAutoSpawn = {
  body_worker: new body_base([WORK, WORK, CARRY, MOVE]),

  /** @param {String} role 
   *  @param {Number} maxnum**/
  run: function (role, maxnum) {
    var ret = false;
    var spawner = Game.spawns['Spawn1'];
    var all_energy = spawner.store.getUsedCapacity(RESOURCE_ENERGY);

    spawner.room.find(FIND_MY_STRUCTURES).forEach((structure, id, arr) => {
      if (structure.structureType == STRUCTURE_EXTENSION) {
        all_energy += structure.store.getUsedCapacity(RESOURCE_ENERGY);
      }
    });

    if (spawner.spawning || all_energy < this.body_worker.cost()) {

    } else {
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
      if (creeps.length < maxnum) {
        var newName = 'worker' + Game.time;
        console.log('Spawning new ' + role + ": " + newName);
        Game.spawns['Spawn1'].spawnCreep(this.body_worker.blue_print, newName,
          {
            memory: {
              role: role,
              state: 'harvesting',
              task: ''
            }
          });
        ret = true;
      }
    }

    return ret;
  }
};

module.exports = taskAutoSpawn;