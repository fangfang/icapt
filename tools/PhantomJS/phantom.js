var $ = window['phantom'];
var args = $.args;
if (args.length < 2) {
    $.exit();
}

if ($.state.length === 0) {
    $.state = Date.now().toString();
    $.viewportSize = {width:1124,height:500};
    $.open(args[0]);
} else {
    if (!document.body.style.background) {
        document.body.style.background = '#fff';
    }
    $.sleep(200);
    $.render(args[1]);
    $.exit();
}
