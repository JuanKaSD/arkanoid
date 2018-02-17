$(function (){
    game.init(0, true);
    menu.writeMenu();
    $("#info #0").css({"background":"blue"});
    $(".stages").click(function() {
        $(".stages").css("background-color", "grey");
        game.stop();
        game.init($(this).attr("id"),true);
        $(this).css({"background":"blue"});
    });
});
$(document).on("keydown", function( event ) {
    if(event.which == 37){
        stick.speedX = -10;
        stick.move();
    }
    if(event.which == 39){
        stick.speedX = 10;
        stick.move();
    }
    if(event.which == 32){ 
        game.start();
    }
    if(event.which == 27){
        game.stop();
    }
});
$(document).on("keyup", function(event){
    if(event.which == 37 || event.which == 39){
        stick.stop();
    }
});
