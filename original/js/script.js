var audio = new Audio();
var $ctr = $('#boxes');
var $current = null;
var status = null;
initAudioEvents();
loadView();
initPlayEvents();

function initPlayEvents() {
    $('>div',$ctr).on('click',function() {
        boxclick($(this));
    });
    $('#controls > .topause').on('click',function() {
        pause();
    });
}

function boxclick(obj) {
    var action = true;
    if($current) {
        if(obj[0]==$current[0] && status!='error') {
            audio.play();
            action = false;
        } 
    }
    if(action) {
        var pos = obj[0].getBoundingClientRect();
        var sid = $(obj).data('sid');
        var bg = 'url(img/st/'+stations[sid][0]+'.jpg)';
        $('<div class="anim"></div>').css({
            "top": pos.top+"px",
            "left": pos.left+"px",
            "background-image": bg
        }).appendTo('body').animate({
            top: "20px", 
            left: "20px", 
            width: "50px",
            height: "50px",
            borderRadius: "25px"
        },300,function(e){            
            $('#controls > .station').css('background-image',bg);
            $(this).remove();
            $current = obj;
            $('#controls p').text(stations[sid][1]);            
            audio.src = stations[sid][2];
            audio.play();
        });
    }
}

function pause() {
    if(status=='playing') {
        audio.pause();
    }  
    else if(status=='pause')   {
        audio.play();
    }
}

function loadView() {
    for(var i=0;i<stations.length;i++) {
        addBox(i,stations[i][0]);
    }
}

function addBox(index,img) {
    $ctr.append('<div id="s'+index+'" data-sid="'+index+'" style="background-image:url(img/st/'+img+'.jpg)">');
}

function initAudioEvents() {    
    // -- possible events 
    // https://www.w3schools.com/tags/ref_av_dom.asp          
    ['error','stalled','loadstart','playing','pause'].map( function(evt) {
        audio.addEventListener(evt,function (e) {
            setStatus(e.type);                  
        });
    });   
}

function setStatus(st) {    
    switch(st) {
        case 'loadstart':
            $('#controls').removeClass().addClass('loading');
            $('#controls').removeClass().addClass('loading');
        break;
        case 'playing':
            $('#controls').removeClass().addClass('playing');
        break;
        case 'pause':
            $('#controls').removeClass().addClass('pause');
        break;
        default: 
            $('#controls').removeClass().addClass('error');
            $('#controls > .station').css('background-image','url(img/err.png)');
    }
    if(st) {
        status = st;
    }
    
}
