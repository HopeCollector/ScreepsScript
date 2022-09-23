var construct_priority = {
  [STRUCTURE_ROAD]: 0,
  [STRUCTURE_EXTENSION]: 1,
  [STRUCTURE_TOWER]: 1,
  [STRUCTURE_RAMPART]: 2,
  [STRUCTURE_WALL]: 2,
  [STRUCTURE_CONTAINER]: 3
};

var repair_priority = {
  [STRUCTURE_TOWER]: 0,
  [STRUCTURE_RAMPART]: 1,
  [STRUCTURE_ROAD]: 1,
  [STRUCTURE_WALL]: 2
};

var LIFE_CORDON = 1000;

function priority(task) {
  var ret = 0.0;
  var obj = Game.getObjectById(task.id);
  if (task.type == 'repair') {
    ret = repair_priority[obj.structureType];
    if (obj.hits < LIFE_CORDON) {
      ret -= 2;
    }
    ret = Math.pow(10, ret) * obj.hits;
  } else if (task.type == 'construct') {
    ret = Math.pow(10, construct_priority[obj.structure]) * task.need;
  }

  return ret;
}

var roleBuilder = {

  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.state == 'working' || creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.state == 'harvesting';
      creep.say('🔄 harvest');
    }
    if (creep.memory.state == 'harvesting' && creep.store.getFreeCapacity() == 0) {
      creep.memory.state = 'working';
      creep.say('🚧 build');
    }

    if (creep.memory.state == 'working') {
      // wait for full creep function
      // var targets = [];
      // creep.room.find(FIND_STRUCTURES).forEach((obj, idx, arr) => {
      //   if (obj.hits < obj.hitsMax) {
      //     targets.push({
      //       type: 'repair',
      //       id: obj.id,
      //       need: obj.hitsMax - obj.hits
      //     });
      //   }
      // });
      // creep.room.find(FIND_CONSTRUCTION_SITES).forEach((obj, idx, arr) => {
      //   targets.push({
      //     type: 'construct',
      //     id: obj.id,
      //     need: obj.progressTotal - obj.progress
      //   });
      // });
      // targets.sort((a, b) => {
      //   var da = priority(a) + (Math.abs(a.pos.x - creep.pos.x) + Math.abs(a.pos.y - creep.pos.y));
      //   var db = priority(b) + (Math.abs(b.pos.x - creep.pos.x) + Math.abs(b.pos.y - creep.pos.y));
      //   return da - db;
      // });

      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      var repairs = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
      });
      if (repairs.length) {
        repairs.sort((a, b) => {
          var d_a = Math.pow(10, repair_priority[a.structureType]) * (Math.abs(a.pos.x - creep.pos.x) + Math.abs(a.pos.y - creep.pos.y)) + a.hits;
          var d_b = Math.pow(10, repair_priority[b.structureType]) * (Math.abs(b.pos.x - creep.pos.x) + Math.abs(b.pos.y - creep.pos.y)) + b.hits;
          return d_a - d_b;
        });
        if (creep.repair(repairs[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(repairs[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else if (targets.length) {
        targets.sort((a, b) => {
          return construct_priority[a.structureType] - construct_priority[b.structureType];
        });
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    } else if (creep.memory.state == 'harvesting') {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
};

module.exports = roleBuilder;