var role_harvester = require('role.harvester');
var role_upgrader = require('role.upgrader');
var role_builder = require('role.builder');
var task_autoSpawn = require('task.autospawn');
var task_manager = require('task.manager');

module.exports.loop = function () {

    // task_manager.get_all_tasks();

    // 删除死掉的 creep
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // 保持 creep 的数量在一个合理的范围内，目前是固定在一个数值上
    if (task_autoSpawn.run('harvester', 3)) { }
    else if (task_autoSpawn.run('upgrader', 1)) { }
    else if (task_autoSpawn.run('builder', 5)) { }

    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    // tower
    var tower = Game.getObjectById('63259f1891704e97a6eb7149');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < 10
        });
        if (closestDamagedStructure) {
            console.log(closestDamagedStructure.hits);
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            role_harvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            role_upgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            role_builder.run(creep);
        }
    }
}