var audio = new Audio();
var $ctr = $('#boxes');
var $current = null;
var status = null;
initAudioEvents();
loadView();
initPlayEvents();

function initPlayEvents() {
    $('>div', $ctr).on('click', function () {
        boxclick($(this));
    });
    $('#controls > .topause').on('click', function () {
        pause();
    });
}

function boxclick(obj) {
    if ($current==null ||  $current[0] != obj[0] || status != 'playing') {
        var pos = obj[0].getBoundingClientRect();
        var sid = $(obj).data('sid');
        var bg = 'url(img/st/' + stations[sid][0] + '.jpg)';
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
            $current = obj;
            $('#controls p').text(stations[sid][1]);
            audio.src = stations[sid][2];
            audio.play();
        });
    }
}

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

function loadView() {
    for (var i = 0; i < stations.length; i++) {
        addBox(i, stations[i][0]);
    }
}

function addBox(index, img) {
    $ctr.append('<div id="s' + index + '" data-sid="' + index + '" style="background-image:url(img/st/' + img + '.jpg)">');
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
        case 'error': // do this in case error: $('#controls').removeClass().addClass('error');
            st = evt;
    }
    if (st) {
        dbg += ' > ' + st;
        status = st;
        $('#controls').removeClass().addClass(st);
    }
    //console.log(dbg);
}