<!DOCTYPE html>
<html>
<head>
    <script src="//cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
</head>
<body>
    <script>
        var config = {
            type: Phaser.AUTO,
            width: 1280,
            height: 720,
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        var game = new Phaser.Game(config);

        function preload ()
        {
            this.load.image('water', 
                'assets/water/TS_Water.png',
            );
            // this.load.spritesheet('character1', 
            //     'assets/characters/char1_fishingrod_animation_32x32.png',
            //     { frameWidth: 32, frameHeight: 32 }
            // );
        }

        function create ()
        {
            water = this.add.tileSprite(640, 200, 1280, 400, "water", 0, 0);
        }

        function update ()
        {
        }
    </script>

</body>
</html>