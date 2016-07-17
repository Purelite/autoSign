/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-07-17 13:31:34
 * @version $Id$
 */

var email = require('../config.js').email;
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: email.host,
  port:465,
  secureConnection: true,
  auth: {
    user: email.user,
    pass: email.password
  }
});

/**
 * 发送邮件
 * @param contents
 */
module.exports = function (contents) {
  transporter.sendMail({
    from: email.user,
    to: email.toUser,
    subject: '字幕组每日签到',
    text: contents || '我靠，失败了!自己手动签到吧'
  }, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.response);
    }
    transporter.close(); //关闭连接池
  });
};
