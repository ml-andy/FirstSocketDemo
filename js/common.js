$(document).ready(function(){
    var webData ={};    

    //Init    
    var socket = io();
    if(getUrlVars()['roomid']){
        socket.emit('enterRoom', getUrlVars()['roomid']);
    }else{
        $('.creatTeam').fadeIn(); 
    }
    

    //AddListener
    $('.teamName').keypress(function(e){
        if(e.keyCode ==13){
            console.log('create team');
            socket.emit('createTeam', $('.teamName').val());
        }
    })
    $('#sendbox').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('ioAlert', function(_alert){        
        $('.teamName').val(_alert.msg);
    });    
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('sure_enterRoom', function(){
        alert('歡迎你');
        showcreatTeam(false);
    });
    

    $(window).load(windowload);
    function windowload(){        
        $('.teamName').focus();
        showLoading(false);
        
    }

   
    //Eevent
    function showcreatTeam(_t){
        if(_t){
            $('.creatTeam').fadeIn();
        }else{            
            showLoading(false);
        }
    }
    function showLoading(_t){
        if(_t) $('.loading').fadeIn();
        else $('.loading').fadeOut();
    }

    
})//ready end
function getUrlVars(){
    var vars=[],hash;var hashes=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');
    for(var i=0;i<hashes.length;i++){hash=hashes[i].split('=');vars.push(hash[0]);vars[hash[0]]=hash[1]}
    return vars
}
