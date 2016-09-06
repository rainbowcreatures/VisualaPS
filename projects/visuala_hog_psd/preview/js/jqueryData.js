// Based on answer here http://stackoverflow.com/questions/2891452/jquery-data-selector/2895933#2895933 by James(http://stackoverflow.com/users/21677/james)

(function(){

    var matcher = /\s*(?:((?:(?:\\\.|[^.,])+\.?)+)\s*([!~><=]=|[><])\s*("|')?((?:\\\3|.)*?)\3|(.+?))\s*(?:,|$)/g;

    function resolve(element, data) {
        data = data.match(/(?:\\\.|[^.])+(?=\.|$)/g);
        var cur = $(element).data()[data.shift()];
        while (cur && data[0]) {
            cur = cur[data.shift()];
        }

        return cur || undefined;

    }

    jQuery.expr[':'].datafind = function(el, i, match) {

        matcher.lastIndex = 0;

        var expr = match[3],
            m,
            check, val,
            allMatch = null,
            foundMatch = false;

        while (m = matcher.exec(expr)) {

            check = m[4];
            val = resolve(el, m[1] || m[5]);

            switch (m[2]) {
                case '==': foundMatch = val == check; break;
                case '!=': foundMatch = val != check; break;
                case '<=': foundMatch = val <= check; break;
                case '>=': foundMatch = val >= check; break;
                case '~=': foundMatch = RegExp(check).test(val); break;
                case '>': foundMatch = val > check; break;
                case '<': foundMatch = val < check; break;
                default: if (m[5]) foundMatch = !!val;
            }

            allMatch = allMatch === null ? foundMatch : allMatch && foundMatch;

        }

        return allMatch;

    };

}());