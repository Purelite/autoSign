/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-07-17 13:37:12
 * @version $Id$
 */

var request = require('superagent');
var sendEmail = require('./sendEmail');

var headerLogin = {
	'Accept':'application/json, text/javascript, */*; q=0.01',
	'Accept-Encoding':'gzip, deflate',
	'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,zh-TW;q=0.2',
	'Connection':'keep-alive',
	'Content-Length':'87',
	'Content-Type':'application/x-www-form-urlencoded',
	//'Cookie':'PHPSESSID=0jbap9u80g2ssij62r2hluft71; ctrip=ctrip%2F1468732106; cps=suning%2F1468732106%3Byhd%2F1468732123%3Btujia%2F1468732169%3Bwomai%2F1468732275; CNZZDATA1254180690=975292202-1466226830-null%7C1468733135',
	'Host':'www.zimuzu.tv',
	'Origin':'http://www.zimuzu.tv',
	'Referer':'http://www.zimuzu.tv/user/login',
	'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
	'X-Requested-With':'XMLHttpRequest',
};

var headerSign = {
    'Accept':'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding':'gzip, deflate, sdch',
    'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,zh-TW;q=0.2',
    'Proxy-Connection':'keep-alive',
    //'Cookie':'PHPSESSID=0jbap9u80g2ssij62r2hluft71; ctrip=ctrip%2F1468732106; cps=suning%2F1468732106%3Byhd%2F1468732123%3Btujia%2F1468732169%3Bwomai%2F1468732275; CNZZDATA1254180690=975292202-1466226830-null%7C1468733135',
    'Host':'www.zimuzu.tv',
    'Referer':'http://www.zimuzu.tv/user/sign',
    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    'X-Requested-With':'XMLHttpRequest',
};

var origin = 'www.zimuzu.tv',
    urls = {
        login: origin + '/User/Login/ajaxLogin',//登陆接口
        checkIn: origin + '/user/login/getCurUserTopInfo'//签到接口
    };


/**
 * 自动签到
 * @param account {object}
 * @constructor
 */
function autoCheckIn(account) {
    this.account = account;

    this.cookie = {
        value: null,
        expires: null
    };

    this.init();
}

autoCheckIn.prototype = {
    constructor: autoCheckIn,
    init: function () {
		var that = this;
		that.checkIn();
    },

    // 验证登录，如果凭证没过期，无需重新验证
    _verify: function (cb) {
        Date.now() > this.cookie.expires ? this._login(cb) : cb(this.cookie);
    },

    // 登录
    _login: function (cb) {
        var that = this;
        request
            .post(urls.login)
            .set(headerLogin)
            .type('form')
            .send({
                account:that.account.user,
                password:that.account.password,
                remember:1,
                url_back:'http://www.zimuzu.tv/'
            })
            .redirects(0) // 防止页面重定向
            .end(function (err,result) {
                var cookie = result.headers['set-cookie'];
                that.cookie = {
                    value: cookie,
                    expires: cookie.join().match(/expires=(.*);/)[1]
                };
                cb(that.cookie);
            });
    },

    // 签到
    checkIn: function (cb) {
        var that = this;

        that._verify(function (cookie) {
            request
                .get(urls.checkIn)
                .set(headerSign)
                .set('Cookie', cookie.value.join())
                .end(function (err,data) {
                    //console.log('返回结果------111---',data.text);
                    var reqVal = data.text;
                    var mailContent = that.account.user + '，签到完毕! Have a Nice Day';
                    if(reqVal.status == 1){
                        mailContent = that.account.user + '，签到完毕。您现在是'+reqVal.data.userinfo.group_name+' Have a Nice Day!';    
                    }
                    sendEmail(mailContent);
                    console.log('======', '签到完毕，' + that.account.user, '======');
                });
        });
    }
};


module.exports = function (account) {
    return new autoCheckIn(account);
};