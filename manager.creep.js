class BaseCreep {
  constructor(creep) {
    this.obj = creep;

    if (creep.memory.task) {
      this.task = creep.memory.task;
    } else {
      this.task = "";
    }


    if (creep.memory.state) {
      this.state = creep.memory.state;
    } else {
      this.state = 'working';
    }

    if (creep.memory.role) {
      this.role = creep.memory.role;
    } else {
      this.role = 'worker';
    }
  }

  destructor() {
    this.obj.memory.task = this.task;
    this.obj.memory.state = this.state;
    this.obj.memory.role = this.role;
  }
}

var roleWorker = {

};

module.exports = roleWorker;