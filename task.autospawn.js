var taskAutoSpawn = {

  /** @param {String} role 
   *  @param {Number} maxnum**/
  run: function (role, maxnum) {
    var spawner = Game.spawns['Spawn1'];
    if (spawner.spawning) {
      // console.log('Spawn1 busy');
      return;
    } else {
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
      if (creeps.length < maxnum) {
        var newName = 'worker' + Game.time;
        console.log('Spawning new ' + role + ": " + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE], newName,
          { memory: { role: role } });
      }
    }
  }
};

module.exports = taskAutoSpawn;