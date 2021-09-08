class MainMap extends Phaser.Scene {
    //THIS SCENE IS THE MAIN SCREEN
    constructor () {
        
        super({key: 'MainMap', active: false})
    }

    init () {
        console.log("Start MainMap")

        this.CONFIG = this.sys.game.CONFIG;
    }

    preload () {

        this.load.image('dirt', 'assets/images/water/TS_Dirt_Water.png')
        this.load.image('grass', 'assets/images/water/TS_Water.png')
        this.load.image('extra', 'assets/images/water/water_misc_16x16.png')
        this.load.image('tree', 'assets/images/other/Palmtree_n_fruits.png')
        this.load.spritesheet('character', 'assets/characters/char1_fishingrod_animation_32x32.png', {
            frameWidth: 32,
            frameHeight: 32
        })

            // load the JSON file
        this.load.tilemapTiledJSON('map', 'assets/json/DigiFishMainMapLong.json')
    }

    create () {

        const map = this.make.tilemap({ key: 'map'})
        const tileset = map.addTilesetImage('TS_Water','grass')
        const tileset2 = map.addTilesetImage('TS_Dirt_Water','dirt')
        const tileset3 = map.addTilesetImage('water_misc_16x16','extra')
        const tileset4 = map.addTilesetImage('Palmtree_n_fruits','tree')
        const tileset5 = map.addTilesetImage('Character','character')

        const allLayers = [tileset, tileset2, tileset3, tileset4]

        var ground = map.createLayer('Ground', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var water = map.createLayer('Water', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var objs = map.createLayer('Objs', allLayers, 0, 0).setScale(this.assetsScaleFactor)

        this.character = this.add.sprite(80, 90, 'character');

        this.anims.create({
            key: 'right',
            frames: [ { key: 'character', frame: 12 } ],
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'down',
            frames: [ { key: 'character', frame: 1 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'up',
            frames: [ { key: 'character', frame: 9 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'left',
            frames: [ { key: 'character', frame: 4 } ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'throw',
            frames: this.anims.generateFrameNumbers('character', { start: 1, end: 3 }),
            frameRate: 10,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update () {
        console.log("update")
        if (this.cursors.left.isDown)
        {
            this.character.x = this.character.x - .5;

            this.character.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.character.x = this.character.x + .5;

            this.character.anims.play('right', true);
        }
        else if (this.cursors.down.isDown) {
            this.character.y = this.character.y + .5;

            this.character.anims.play('down', true);
        }
        else if (this.cursors.up.isDown) {
            this.character.y = this.character.y - .5;

            this.character.anims.play('up', true);
        }
        else if (this.cursors.space.isDown) {
            this.character.anims.play('throw', true);
        }
    }
}