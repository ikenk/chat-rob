class SuperTask {
  constructor(parallelCount = 2) {
    this.parallelCount = parallelCount; //并发数量
    this.taskList = []; //任务列表
    this.runningCount = 0; //正在执行的任务数量
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.taskList.push({
        task,
        resolve,
        reject,
      });
      this._run();
      // console.log(this);
    });
  }

  //执行任务
  _run() {
    while (this.runningCount < this.parallelCount && this.taskList.length > 0) {
      const { task, resolve, reject } = this.taskList.shift();
      this.runningCount++;
      task()
        .then(
          (res) => {
            resolve();
          },
          (err) => {
            reject();
          },
        )
        .finally(() => {
          this.runningCount--;
          this._run();
        });
    }
  }
}

const superTask = new SuperTask();

function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function addTask(time, name) {
  superTask
    .add(() => timeout(time))
    .then(() => {
      console.log(`任务${name}完成`);
    });
}

addTask(10000, 1);
addTask(5000, 2);
addTask(3000, 3);
addTask(4000, 4);
addTask(5000, 5);
