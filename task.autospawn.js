var taskAutoSpawn = {

  /** @param {String} role 
   *  @param {Number} maxnum**/
  run: function (role, maxnum) {
    var spawner = Game.spawns['Spawn1'];
    if (spawner.spawning) {
      // console.log('Spawn1 busy');
      return;
    } else {
      var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == role);
      if (harvesters.length < maxnum) {
        var newName = role + Game.time;
        console.log('Spawning new ' + role + ": " + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
          { memory: { role: role } });
      }
    }
  }
};

module.exports = taskAutoSpawn;