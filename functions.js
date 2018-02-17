var scenary = {
    el: null,
    count: 0,
    numRows: 0,
    stage: null,
    lengthStage: null,
    createStage: function(n){
        scenary.chargeStage(n);
        scenary.el.html("");
        scenary.el.append("<table>");
        var count = 0
        for (let i = 0; i < scenary.stage.length; i++) {
            $("#game table").append("<tr id='row"+i+"'>");
            for (let j = 0; j < scenary.stage[i].length; j++, count++) {
                var random = Math.floor(Math.random()*30);
                if(scenary.stage[i][j] == 0){
                    $("#game table #row"+i).append("<td></div>");
                }
                if(scenary.stage[i][j] == 1){
                    if(random == 28)
                        $("#game table #row"+i).append("<td><div id='"+count+"' class='OneLifes surprise' style='color:white; border-color:yellow;'>1</div>");
                    else
                        $("#game table #row"+i).append("<td><div id='"+count+"' class='OneLifes' style='color:white;'>1</div>");
                }
                if(scenary.stage[i][j] == 2){
                    if(random == 28)
                        $("#game table #row"+i).append("<td><div id='"+count+"' class='TwoLifes surprise' style='color:white; border-color:yellow;'>2</div>");
                    else
                    $("#game table #row"+i).append("<td><div id='"+count+"' class='TwoLifes' style='color:white'>2</div>");
                }
                if(scenary.stage[i][j] == 3){
                    if(random == 28)
                        $("#game table #row"+i).append("<td><div id='"+count+"' class='ThreeLifes surprise' style='color:white; border-color:yellow;'>3</div>");
                    else 
                        $("#game table #row"+i).append("<td><div id='"+count+"' class='ThreeLifes' style='color:white'>3</div>");
                }
            }
            scenary.numRows = i+1;
        }   
        scenary.count = count;
        scenary.el.append("<div class='ball' id='ball'></div>");
        scenary.el.append("<div class='stick' id='stick'></div>");
        scenary.el.append("<div class='insert'></div>");
        scenary.el.hide().fadeIn();
    },
    chargeStage: function(which){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                stagePar = [];
                lengthStagePar = 0;
                var array1 = this.responseText.split("#");
                for (let i = 0; i < array1.length; i++) {
                    stagePar[i] = array1[i].split("/");
                    for (let j = 0; j < array1[i].split("/").length; j++) {
                        lengthStagePar++;      
                    }
                }
                scenary.stage = stagePar;
                scenary.lengthStage = lengthStagePar;
            }
        };
        xhr.open("POST","selectStage.php",false); //ruta POST definida en web.php
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var parametros = "which="+which;
        xhr.send(parametros);
    },
    init: function(){
        this.el = $("#game");
    }
};
var ball = {
    el: null,
    speedX: 0,
    speedY: 0,
    interval: null, 
    init: function(){
        ball.el = $("#ball");
    },
    move: function (auto){
        ball.interval = setInterval(function (){
            ball.el.css({"top":"+="+ball.speedY});
            ball.el.css({"left":"+="+ball.speedX});
            ball.check()
            console.log(auto);
            if(auto == true){
                stick.autoMoveStick();
            }
        },30);
    },
    stop: function(){
        clearInterval(ball.interval);
    },
    check: function(){
        var bounds = document.getElementById("ball").getBoundingClientRect();
        var gameBounds = document.getElementById("game").getBoundingClientRect();
        if(bounds.bottom >= gameBounds.bottom){
            alert("GAME OVER");
            game.stop();
            game.init(0, true);
        }else{
            stickBounds = document.getElementById("stick").getBoundingClientRect();
            if(bounds.top <= gameBounds.top || bounds.bottom >= gameBounds.bottom){
                ball.speedY*=(-1);
            }
            if(bounds.left <= gameBounds.left || bounds.right >= gameBounds.right){
                ball.speedX*=(-1);
            }
            if(bounds.bottom >= stickBounds.top && bounds.right >= stickBounds.left && bounds.left <= stickBounds.right){
                ball.speedY*=(-1);
                methods.play("hit.wav");
            }
            $("#game table div").each(function(){
                var id = $(this).attr('id');
                var block = document.getElementById(id);
                var blockBounds = block.getBoundingClientRect();
                if(!(blockBounds.top > bounds.bottom ||
                blockBounds.right < bounds.left ||
                blockBounds.bottom < bounds.top ||
                blockBounds.left > bounds.right
                )){
                    if(Math.abs(blockBounds.left - bounds.right) < 10 ||
                    Math.abs(blockBounds.right - bounds.left) < 10
                    ){
                        ball.speedX *= (-1);
                    }else{
                        ball.speedY *= (-1);
                    }
                    methods.breakBrick($(this));
                }
            });
        }
    }
};
var stick = {
    el: null,
    interval: null,
    speedX: 0,
    init:function(){
        stick.el = $("#stick");
    },
    move: function (){
        if(stick.interval == null){
            stick.interval = setInterval(function (){
                stick.el.css({"left":"+="+stick.speedX});
                stick.check();
            },20);  
        }
    },
    stop: function(){
        stick.speedX = 0;
        clearInterval(stick.interval);
        stick.interval = null;
        console.log("stopped");
    },
    check: function(){
        bounds = stick.el.position();
        gameBounds = $("#game").position();
        if(bounds.left <= gameBounds.left){
            stick.el.css({"left":gameBounds.left});
            stick.stop();
        }
        if((bounds.left + stick.el.width()) >= ($("#game").width() + gameBounds.left)){
            var x = $("#game").width() - stick.el.width() +20;
            stick.el.css({"left":x});
            stick.stop();            
        }
    },
    increase: function(){
        stick.el.css("width","250px");
        setTimeout(function(){
            stick.el.css("width","130px");
        },10000);
    },
    decrease: function(){
        stick.el.css("width","70px");
        setTimeout(function(){
            stick.el.css("width","130px");
        },10000);
    },
    autoMoveStick: function(){
        var ballPosition = $("#ball").position().left+($("#ball").width()/2);
        $("#stick").css({"left":ballPosition-+($("#stick").width()/2)});  
    }
};
var methods = {
    breakBrick: function(element){
        if(element.html() == "3"){
            element.html("2");
            element.css({"background-image":"url('resources/brick2Lv.png')"});
            methods.play("hitbrik.wav");
        }else if(element.html() == "2"){
            element.html("1");
            element.css({"background-image":"url('resources/brick1Lv.png')"});
            methods.play("hitbrik.wav");
        }else if(element.html() == "1"){
            methods.play("hitbrik.wav");
            element.show().hide("slow");    
            element.css({"display":"none"});
            element.css({"top":"-1000"});
            scenary.count = scenary.count -1;
            if(scenary.count == 0){
                alert("YOU WON!");
                game.stop();
                game.init(1, true);
            }
            //IF IT HAS SURPRISE
            if(element.css("border-color") == "rgb(255, 255, 0)"){
                var random = Math.round(Math.random());
                var intervalUpgrade = null;
                var blockBounds;
                var id;
                if(random == 0){
                    id = "more";
                    $("#game").append("<div class='upgrade' id='more'></div>");
                }else{
                    id = "less";
                    $("#game").append("<div class='upgrade' id='less'></div>");
                }
                $("#"+id).css({"left":(Math.round(Math.random()*600)+1)});
                
                intervalUpgrade = setInterval(function (){
                    var stickBounds = document.getElementById("stick").getBoundingClientRect();
                    blockBounds = document.getElementById(id).getBoundingClientRect();
                    $("#"+id).css({"top":"+=7"});
                    if(blockBounds.bottom >= stickBounds.top){
                        clearInterval(intervalUpgrade);
                        if(blockBounds.right >= stickBounds.left && blockBounds.left <= stickBounds.right){
                            if(id == "less"){
                                stick.decrease();
                            }else{
                                stick.increase();
                            }
                        }
                        $("#"+id).show().hide("slow");
                    }
                },30);

            }
        }
    }, play(path){
        path = "resources/"+path;
        var snd = new Audio(path);
        snd.play();
    }
}
var menu = {
    el: null,
    stages: null,
    init: function(){
        menu.el = $("#info");
        menu.getStages();
    },
    writeMenu: function(){
        menu.el.html("");
        menu.el.html("<p class='title'>STAGES</p> <hr>");
        for (let i = 0; i < menu.stages.length-1; i++) {
            console.log(menu.stages[i]);
            menu.el.append("<div class='stages' id='"+i+"'>"+(i+1)+"</div>");
        }
        menu.el.append("<br><br><p class='title'>CONTROLS</p><hr>");  
        menu.el.append("<p style='color:black;'>SPACE --> START<br><br>ESC --> STOP<br><br>LEFT ARROW --> MOVE LEFT <br><br>RIGHT ARROW --> MOVE RIGHT</p>");
    },
    getStages: function(){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                menu.stages = this.responseText.split(","); 
            }
        };
        xhr.open("POST","getStages.php",false); //ruta POST definida en web.php
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send();
    }
}
var game = {
    init: function(n, auto){
        scenary.init();
        scenary.createStage(n);
        ball.init();
        var r1 = Math.round(Math.random());
        ball.speedY = -10;
        if(r1 == 1){
            ball.speedX = 10;
        }else{
            ball.speedX = -10;
        }
        
        ball.move(auto);
        stick.init();
        menu.init();
    }, 
    start: function(){
        ball.stop();
        game.stop();
        var stage;
        $(".stages").each(function(){
            if($(this).css("background-color") == "rgb(0, 0, 255)"){
                stage = $(this).attr("id");
            }
        });
        game.init(stage, false);
        $(".insert").show().hide("slow");
    },
    stop: function(){
        ball.speedY = 0;
        ball.speedX = 0;
        ball.stop();
        stick.speedX = 0;
    }
}