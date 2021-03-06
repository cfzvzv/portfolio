export function parse(str) {
    return ("" + str)
        .replace(/[;\s]+$/, "")
        .split(";")
        .map(item => {
            let temp = {};
            let values = ("" + item.split('="')[1]).split("~");
            let code = item.split('="')[0].split("_")[1];
            [
                "X1",
                "名字",
                "代码",
                "当前价格",
                "昨收",
                "今开",
                "成交量",
                "外盘",
                "内盘",
                "买一",
                "买一量",
                "买二",
                "买二量",
                "买三",
                "买三量",
                "买四",
                "买四量",
                "买五",
                "买五量",
                "卖一",
                "卖一量",
                "卖二",
                "卖二量",
                "卖三",
                "卖三量",
                "卖四",
                "卖四量",
                "卖五",
                "卖五量",
                "最近逐笔成交",
                "时间",
                "涨跌",
                "涨跌%",
                "最高",
                "最低",
                "价格/成交量/成交额",
                "成交量",
                "成交额",
                "换手率",
                "市盈率",
                "X2",
                "最高",
                "最低",
                "振幅",
                "流通市值",
                "总市值",
                "市净率",
                "涨停价",
                "跌停价"
            ].forEach(name => {
                temp[name] = values.shift() || "";
            });
            temp["最近逐笔成交"] = ("" + temp["最近逐笔成交"]).split("|");
            temp["市场代码"] = code;
            return temp;
        });
}

export function formatTime(timestamp) {
    let datetime = new Date(timestamp);
    let format = datetime.getTime();
    let H = datetime.getHours();
    let M = datetime.getMinutes();
    let today = ("0" + H).substr(-2) + ':' + ("0" + M).substr(-2);
    let month = datetime.getMonth() + 1;
    let date = datetime.getDate();
    let history = ("0" + month).substr(-2) + '-' + ("0" + date).substr(-2);
    // console.log(format);
    // console.log(n.time);
    let nowDate = new Date();
    let getTD = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0).getTime();
    let getYD = getTD - 24 * 60 * 60 * 1000;
    if (format > getTD) {
        return today;
    } else if ((format < getTD) && (format > getYD)) {
        return '昨天';
    } else {
        return history;
    }
}

export function throttle(action, delay) {
    let statTime = 0;
    return function () {
        let currTime = Date.now();
        if (currTime - statTime > delay) {
            action.apply(this, arguments);
            statTime = currTime;
        }
    }
}



// export default {
//     parse,
//     add
// };