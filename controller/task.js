/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-07-17 13:38:25
 * @version $Id$
 */

var later = require('later');
/**
 * 定时任务
 * @param time 参考later的base time
 * @param intervalFn 定时执行的函数
 */
module.exports = function (time, intervalFn) {
    var sched = {schedules: [time]};
    later.date.localTime();	
    later.setInterval(intervalFn, sched);
};
