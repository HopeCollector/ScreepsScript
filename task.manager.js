var tmp = {
  get_all_tasks: () => {
    var gen_task_id = (type, obj) => {
      return type.toString() + ": " + obj.pos.x.toString() + ", " + obj.pos.y.toString();
    };

    var all_tasks = {};
    // get all rooms
    for (var spawn_name in Game.spawns) {
      var room_name = Game.spawns[spawn_name].room.name;
      if (!(room_name in all_tasks)) {
        all_tasks[room_name] = {};
      }
    }

    for (var room_name in all_tasks) {
      var room = Game.rooms[room_name];
      var room_tasks = all_tasks[room_name];
      // add harvest task
      room.find(FIND_MY_SPAWNS).forEach((spawn, idx, arr) => {
        if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
          room_tasks[gen_task_id('spawn', spawn)] = {
            type: 'spawn',
            id: spawn.id,
            need: spawn.store.getFreeCapacity(RESOURCE_ENERGY),
            level: 0
          };
        }
      });

      // add extenstion task
      room.find(FIND_MY_STRUCTURES).forEach((structure, idx, arr) => {
        if (structure.structureType != STRUCTURE_EXTENSION) {
          return;
        }

        if (structure.store.getFreeCapacity > 0) {
          room_tasks[gen_task_id('extension', structure)] = {
            type: 'extension',
            id: structure.id,
            need: structure.store.getFreeCapacity(),
            level: 1
          };
        }
      });


      // add repair task
      room.find(FIND_MY_STRUCTURES).forEach((structure, idx, arr) => {
        if (structure.hits < structure.hitsMax) {
          room_tasks[gen_task_id('repair', structure)] = {
            type: 'repair',
            id: structure.id,
            need: structure.hitsMax - structure.hits,
            // 如果设备的生命值不足 100 就设置为最高优先级
            // 否则设置为 2，比充能工作要低一点
            level: (() => {
              if (structure.hits < 100) return 0;
              else return 2;
            })()
          };
        }
      });

      // add build task
      room.find(FIND_MY_CONSTRUCTION_SITES).forEach((job, idx, arr) => {
        if (job.progress < job.progressTotal) {
          room_tasks[gen_task_id('construct', job)] = {
            type: 'construct',
            id: job.id,
            need: job.progressTotal - job.progress,
            level: 3
          };
        }
      });

      // add container task
      room.find(FIND_MY_STRUCTURES).forEach((structure, idx, arr) => {
        var type = structure.structureType;
        if (type == STRUCTURE_CONTAINER) {
          room_tasks[gen_task_id('store', structure)] = {
            type: "store",
            id: structure.id,
            need: structure.store.getFreeCapacity(RESOURCE_ENERGY),
            level: 4
          };
        }
      });

      // gen summary
      var count_task = (type) => {
        var ret = 0;
        for (const task_id in room_tasks) {
          if (room_tasks[task_id].type == type) {
            ret += 1;
          }
        }
        return type;
      };

      var count_need_energy = (type) => {
        var ret = 0;
        for (const task_id in room_tasks) {
          if (room_tasks[task_id].type == type) {
            ret += room_tasks[task_id].need;
          }
        }
        return ret;
      };

      var summary = {
        task_num: {
          total: Object.keys(room_tasks).length,
          spawn: count_task('spawn'),
          extension: count_task('extension'),
          repair: count_task('repair'),
          construct: count_task('construct'),
          store: count_task('store')
        },
        need: {
          spawn: count_need_energy('spawn'),
          extension: count_need_energy('extension'),
          repair: count_need_energy('repair'),
          construct: count_need_energy('construct'),
          store: count_need_energy('store')
        }
      };
      summary.need.total = (() => {
        var ret = 0;
        for (var type in summary.need) {
          ret += summary.need[type];
        }
        return ret;
      })();
      all_tasks[room_name].summary = summary;
    }

    // gen summary
    var summary = {
      task_num: (() => {
        var ret = {};
        for (var room_name in all_tasks) {
          ret[room_name] = all_tasks[room_name].summary.task_num.total;
        }
        return ret;
      })(),
      need: (() => {
        var ret = {};
        for (var room_name in all_tasks) {
          ret[room_name] = all_tasks[room_name].summary.need.total;
        }
        return ret;
      })()
    };
    all_tasks.summary = summary;

    console.log(JSON.stringify(all_tasks.summary, null, ' '));
    for (var room_name in all_tasks) {
      if (room_name != "type") {
        console.log(JSON.stringify(all_tasks[room_name].summary, null, ' '));
      }
    }
  }
}

module.exports = tmp;