---
layout: post
title: 靠谱的JS时间格式化方法
---

# 靠谱的JS时间格式化方法

时间格式化在平常开发中有很多地方会用到，当然市面上也有很多优秀的时间处理插件，比如 `moment.js`。  
以下提供一个日常中总结出来的很多用的时间格式化方法，可以将`Date`对象处理成自己想要的时间格式。

~~~javascript
 function dateFormat(date, fstr, utc) {
    utc = utc ? 'getUTC' : 'get';
    return fstr.replace(/%[YmdHMS]/g, function (m) {
        switch (m) {
        case '%Y':
            return date[utc + 'FullYear'](); // no leading zeros required
        case '%m':
            m = 1 + date[utc + 'Month']();
            break;
        case '%d':
            m = date[utc + 'Date']();
            break;
        case '%H':
            m = date[utc + 'Hours']();
            break;
        case '%M':
            m = date[utc + 'Minutes']();
            break;
        case '%S':
            m = date[utc + 'Seconds']();
            break;
        default:
            return m.slice(1); // unknown code, remove %
        }
        // add leading zero if required
        return ('0' + m).slice(-2);
    });
}
~~~