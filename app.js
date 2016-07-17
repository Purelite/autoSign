/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-07-17 13:40:27
 * @version $Id$
 */

var accounts = require('./config').accounts;
var task = require('./controller/task');
var autoCheckIn = require('./controller/autoCheckIn');

// 定时执行
task({h: [17], m: [40]}, function () {
    accounts.forEach(function (v) {
        autoCheckIn(v);
    });
});
console.log('======', '字幕组每日签到服务运行中..', '======');
