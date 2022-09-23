var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (obj) => {
          return (obj.structureType == STRUCTURE_CONTAINER) && obj.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (targets.length > 0) {
        targets.sort((a, b) => {
          var d_a = Math.abs(a.pos.x - creep.pos.x) + Math.abs(a.pos.y - creep.pos.y);
          var d_b = Math.abs(b.pos.x - creep.pos.x) + Math.abs(a.pos.y - creep.pos.y);
          return d_a - d_b;
        });
        if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        targets = creep.room.find(FIND_SOURCES);
        targets.sort((a, b) => {
          var d_a = Math.abs(a.pos.x - creep.pos.x) + Math.abs(a.pos.y - creep.pos.y);
          var d_b = Math.abs(b.pos.x - creep.pos.x) + Math.abs(a.pos.y - creep.pos.y);
          return d_a - d_b;
        });
        if (creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    }
  }
};

module.exports = roleUpgrader;