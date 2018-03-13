var audio = new Audio();
var $ctr = $('#boxes');
var current = null;
var status = null;
var timer = null;
var sortflag = false;
var err = 0;
initAudioEvents();
loadView();
initPlayEvents();

function pause() {
    if(status && status != 'error') {
        if (status == 'pause') {
            audio.play();
        }
        else {
            audio.pause();
        }
    }
}

function boxclick(obj) {
    var sid = $(obj).attr('id');
    if (current==null || current != sid || status != 'playing') {
        var pos = obj[0].getBoundingClientRect();        
        var bg = 'url(img/st/' + sid + '.jpg)';
        $('<div class="anim"></div>').css({
            "top": pos.top + "px",
            "left": pos.left + "px",
            "background-image": bg
        }).appendTo('body').animate({
            top: "20px",
            left: "20px",
            width: "50px",
            height: "50px",
            borderRadius: "25px"
        }, 300, function (e) {
            $('#controls > .station').css('background-image', bg);
            $(this).remove();
            current = sid;
            $('#controls > p > span').text(stations[sid][0]);
            var diff  = $('#controls > p > span').width() - $('#controls > p').width();
            if(diff>0) {
                //console.log(diff);
                $('#marquee').html(
                    '@keyframes marquee {'+
                        '15%   {transform: translateX(0); }'+
                        '40% {transform: translateX(${diff}px); }'+
                        '60% {transform: translateX(${diff}px); }'+
                        '85% {transform: translateX(0); }'+
                    '}'
                );
            }
            else {
                $('#marquee').empty();
            }
            audio.src = stations[sid][1];
            var playPromise = audio.play();
            if(playPromise){
                playPromise.catch(function(error) {
                    var e = ++err;
                    //console.log('error',e);
                    setTimeout(function() {
                        //console.log('fix',e);
                        sortflag = false;
                        $(obj).removeClass('selected');
                    },800);
                });
            }

        });
    }
}

function setOrder() {
    var order = [];
    $('#boxes > li').each(function(i,o) {
        order.push($(o).attr('id'));
    });    
    localStorage.setItem("stationsOrder",JSON.stringify(order));
    //console.log("NEW ORDER:\n",order.join(','));        
}

function initPlayEvents() {
    $ctr.sortable({
        disabled: true,
        containment: 'parent',
        tolerance: "pointer",
        placeholder: "sortable-placeholder",   
        stop: function() {
            //console.log('sortable stop',sortflag);
            sortflag = false;
        }, 
        update: function() {
            //console.log('sortable update');
            setOrder();
        }        
    });
    $ctr.on('sortupdate', function () {
        setOrder();
        $ctr.sortable("disable");
    });
    $('>li', $ctr).on('taphold', function () {
        //console.log('taphold before',sortflag);
        if(sortflag)   {
            //console.log('>> misfire');
            sortflag = false;
        }
        else {            
            //console.log('>> real');
            $('>li', $ctr).removeClass('selected');
            $ctr.sortable("enable");
            $(this).addClass('selected');            
        }        
        //console.log('taphold after',sortflag);
    });    
    $('>li', $ctr).on('tap', function () {        
        //console.log('tap',sortflag);
        boxclick($(this));
    });
    $('>li', $ctr).on('tapend', function () { 
        sortflag = true;        
        //console.log('tapend',sortflag);
        $(this).removeClass('selected');
    });
    $('#controls > .topause').on('click', function () {
        pause();
    });
}

function addBox(sid) {
    $ctr.append('<li id="' + sid + '" style="background-image:url(img/st/' + sid + '.jpg)"></li>');
}

function loadView() {
    var orderstr = localStorage.getItem("stationsOrder");
    if(orderstr) {
        var order = JSON.parse(orderstr);
        //console.log("LOAD FROM ORDER:\n",order.join(',')); 
        for (var i = 0; i < order.length; i++) {
            addBox(order[i]);
        }
    }
    else {
        //console.log("NORMAL ORDER"); 
        for (var sid in stations) {
            addBox(sid);
        }
    }
}

function eventFire(evt) {
    dbg = evt;
    var st = null;
    switch (evt) {
        case 'play':
        case 'loadstart':
        case 'waiting':
        case 'stalled':
            if (status != 'loading') {
                st = 'loading';
            }
            break;
        case 'playing':
        case 'pause':
        case 'error': 
            st = evt;
    }
    if (st) {
        dbg += ' > ' + st;
        status = st;
        $('#controls').removeClass().addClass(st);
    }
    //console.log(dbg);
}

function initAudioEvents() {
    //['abort','canplay','canplaythrough','durationchange','emptied','ended','error','loadeddata','loadedmetadata','loadstart','pause','play','playing','progress','ratechange','seeked','seeking','stalled','suspend','timeupdate','volumechange','waiting']
    ['play', 'loadstart', 'waiting', 'stalled', 'playing', 'pause', 'error']
    .map(function (evt) {
        audio.addEventListener(evt, function (e) {
            eventFire(e.type);
        });
    });
}


















