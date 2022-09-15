var roleBuilder = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      var ret = creep.harvest(sources[0]);
      switch (ret) {
        case ERR_NOT_IN_RANGE:
          creep.moveTo(sources[0]);
          break;
        case ERR_FULL:
          creep.moveTo(Game.flags['WaitSatge']);
          break;
        default:
          break;
      }
    }
  }
};

module.exports = roleBuilder;