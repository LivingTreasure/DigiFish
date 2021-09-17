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

        //this.createUserInterface();
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

        this.character = this.physics.add.sprite(80, 90, 'character', 0);
        this.character.setBounce(0, 0);
        this.character.setSize(15, 25);
        this.character.body.offset.y = 7;

        this.lineCast = true;

        this.createUserInterface();
        
        // this.character.setOrigin(0.5, 1);

        this.character.setCollideWorldBounds(true);
        water.setCollisionByProperty({ collides: true });
        objs.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.character, water);
        this.physics.add.collider(this.character, objs);

        // this.character.setDepth(10);
        this.cameras.main.setZoom(1)
        this.cameras.main.startFollow(this.character);
        this.cameras.main.roundPixels = true;
        // this.cameras.main.zoom = 0.5;

        this.anims.create({
            key: 'right',
            frames: [ { key: 'character', frame: 12 } ],
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'down',
            frames: [ { key: 'character', frame: 0 } ],
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
            frames: this.anims.generateFrameNumbers('character', { frames: [1, 2, 1] }),
            //frames: [ { key: 'character', frame: 1} ],
            frameRate: 5,
        });

        this.anims.create({
            key: 'pullout',
            frames: this.anims.generateFrameNumbers('character', { frames: [1, 2, 0] }),
            //frames: [ { key: 'character', frame: 1} ],
            frameRate: 5,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update () {
        console.log("update")
        this.character.setVelocityX(0);
        this.character.setVelocityY(0);
        if (this.cursors.left.isDown)
        {
            this.character.setVelocityX(-25);
            this.character.setSize(19,19);
            this.character.body.offset.y = 7;
            this.character.body.offset.x = 11;

            this.character.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.character.setVelocityX(25);
            this.character.setSize(20, 20);
            this.character.body.offset.y = 7;
            this.character.body.offset.x = 1;

            this.character.anims.play('right', true);
        }
        else if (this.cursors.down.isDown) {
            this.character.setVelocityY(25);
            this.character.setSize(15, 25);
            this.character.body.offset.y = 7;

            this.character.anims.play('down', true);
        }
        else if (this.cursors.up.isDown) {
            this.character.setVelocityY(-25);
            this.character.setSize(15, 25);
            this.character.body.offset.y = 0;

            this.character.anims.play('up', true);
        }
        else if (this.cursors.space.isDown) {
            if(!this.lineCast) {
                this.character.anims.play('throw', true);
            } else {
                this.character.anims.play('pullout', true);
            }

            this.lineCast = !this.lineCast;

            // this.sys.game.time.events.add(Phaser.Timer.SECOND, function () {this.character.anims.play('down', true);});
        }
    }

    createUserInterface(){

        //Background
        let x = 215;
        let y = 10;
        let w = 100;
        let h = 140;

        this.interface  = this.add.graphics({x: x, y: y})
        this.border     = this.add.graphics({x: x, y: y})

        this.interface.clear();
        this.interface.fillStyle('0x965D37', 1);
        this.interface.fillRect(0, 0, w, h);
        this.interface.fixedToCamera = true;
        this.interface.setScrollFactor(0)

        this.border.clear();
        this.border.lineStyle(2, '0x4D6592', 1);
        this.border.strokeRect(0, 0, w, h);
        this.border.fixedToCamera = true;
        this.border.setScrollFactor(0)
    }
}