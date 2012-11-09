// game resources
var g_resources= [{
    name: "temp_tiles",
    type: "image",
    src:  "data/temp_tiles.png"
},  {
    name: "test_map",
    type: "tmx",
    src:  "data/test_map.tmx"
},  {
    name: "gripe_run_right",
    type: "image",
    src:  "data/gripe_run_right.png"
}];

// Player
var Player = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.gravity = 0;
        this.setVelocity(3, 3);
        me.game.viewport.setDeadzone(0,0);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.flip = false;
    },

    update: function() {
        var ff = this.flip ? -1 : 1;
        if(me.input.isKeyPressed('right'))  {
            this.flipX(false);
            this.vel.x += this.accel.x * me.timer.tick * ff;
            console.log(this.pos);
        } else if (me.input.isKeyPressed('left')) {
            this.flipX(true);
            this.vel.x -= this.accel.x * me.timer.tick * ff;
        } else {
            this.vel.x = 0;
        }
        if(me.input.isKeyPressed('up')) {
            this.vel.y -= this.accel.y * me.timer.tick * ff;
        } else if (me.input.isKeyPressed('down')) {
            this.vel.y += this.accel.y * me.timer.tick * ff;
        } else { this.vel.y = 0; }

        if (Math.random() < 0.001) {
            this.flip = !this.flip;
        }
        // check & update player movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }
})

var jsApp    =
{
    /*
        Initialize the jsApp
    */
    onload: function()
    {
        // init the video
        if (!me.video.init('jsapp', 640, 480, false, 1.0))
        {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }

        // initialize the "audio"
        //me.audio.init("mp3,ogg");

        // set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // set all resources to be loaded
        me.loader.preload(g_resources);

        // load everything & display a loading screen
        me.state.change(me.state.LOADING);
    },


    /*
        callback when everything is loaded    
    */
    loaded: function ()
    {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());

        me.entityPool.add("player",Player);

        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");

        // start the game 
        me.state.change(me.state.PLAY);
    }

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

    onResetEvent: function()
    {
        // stuff to reset on state change
        me.levelDirector.loadLevel("test_map");
        //me.game.viewport.reset(320,80);
    },


    /* ---
         action to perform when game is finished (state change)
        ---    */
    onDestroyEvent: function()
    {

    }

});

//bootstrap :)
window.onReady(function()
{
    jsApp.onload();
});
