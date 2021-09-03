<!DOCTYPE html>
<html>
<head>
    <script src="//cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    <style>
            body {
              background-color: black;
            }

            .inv {
                float: right;
                background-color: #836231;
                 outline: black solid;
                 height: 100%;
                 width: 30%;
                 margin-right: 5%;
            }

            .title {
                margin-top: 50px;
                margin-bottom: 20px;
                margin-left: 30%;
                font-size: 30pt;
            }

            </style>
</head>
<body>
    <script>
        var config = {
            type: Phaser.AUTO,
            width: 200,
            height: 160,
            // Sets game scaling
             scale: {
            // Fit to window
            mode: Phaser.Scale.FIT,
        },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        var game = new Phaser.Game(config);

        function preload ()
        {
            this.load.image('dirt', 'assets/water/TS_Dirt_Water.png');
            this.load.image('grass', 'assets/water/TS_Water.png');
            this.load.image('extra', 'assets/water/water_misc_16x16.png');
            this.load.image('tree', 'assets/other/Palmtree_n_fruits.png');

            	// load the JSON file
	        this.load.tilemapTiledJSON('map', 'assets/water/DigiFishMainMap.json')

        }

        var map;
        var layer;

        // Set name of tileset and name of tilemap layer
        function create() {

            const map = this.make.tilemap({ key: 'map'})
            const tileset = map.addTilesetImage('TS_Water','grass')
            const tileset2 = map.addTilesetImage('TS_Dirt_Water','dirt')
            const tileset3 = map.addTilesetImage('water_misc_16x16','extra')
            const tileset4 = map.addTilesetImage('Palmtree_n_fruits','tree')

            const allLayers = [tileset, tileset2, tileset3, tileset4]

            layer1 = map.createLayer('Tile Layer 1', allLayers, 0, 0).setScale(this.assetsScaleFactor)
            layer2 = map.createLayer('Tile Layer 2', allLayers, 0, 0).setScale(this.assetsScaleFactor)

            this.scale.displaySize.setAspectRatio( 1000/800 );
            this.scale.refresh();
        }

        function update ()
        {
        }
    </script>

    <div class="inv">
        <div class="panel">
        <h2 class="title"> DigiFish </h2>
        </div>
    </div>

</body>
</html><?php /**PATH C:\DigiFish\DigiFish\DigiFish\resources\views/index.blade.php ENDPATH**/ ?>