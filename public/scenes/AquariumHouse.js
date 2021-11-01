var timedEvent;
var text;
var fishingPossible = false;
var mainScene = false;
var initialX;
var initialY;
var inventory;

class AquariumHouse extends Phaser.Scene {
    //THIS SCENE IS THE HOUSE SCREEN
    constructor () {

        super({key: 'AquariumHouse', active: false})
    }

    init (data) {
        console.log("Start AquariumHouse")

        this.CONFIG = this.sys.game.CONFIG;
        this.timer = 0;

        this.initialX = data.x;
        this.initialY = data.y;
        this.inventory = data.inventory;
    }

    preload () {
        //loads textures
        this.load.image('aquarium', 'assets/images/Modern_Interiors/tankwalls.png')
        this.load.image('bedroom', 'assets/images/Modern_Interiors/Theme_Sorter/4_Bedroom_16x16.png')
        this.load.image('borders', 'assets/images/Modern_Interiors/Room_Builder_subfiles/Room_Builder_borders_16x16.png')
        this.load.image('fishingitems', 'assets/images/Modern_Interiors/Theme_Sorter/9_Fishing_16x16.png')
        this.load.image('floors', 'assets/images/Modern_Interiors/Room_Builder_subfiles/Room_Builder_floors_16x16.png')
        this.load.image('genericfurniture', 'assets/images/Modern_Interiors/Theme_Sorter/1_Generic_16x16.png')
        this.load.image('kitchen', 'assets/images/Modern_Interiors/Theme_Sorter/12_Kitchen_16x16.png')
        this.load.image('livingroom', 'assets/images/Modern_Interiors/Theme_Sorter/2_LivingRoom_16x16.png')
        this.load.image('walls', 'assets/images/Modern_Interiors/Room_Builder_subfiles/Room_Builder_Walls_16x16.png')
        this.load.spritesheet('character', 'assets/characters/char1_fishingrod_animation_32x32.png', {
            frameWidth: 32,
            frameHeight: 32
        })

        // load the JSON file
        this.load.tilemapTiledJSON('mapHome', 'assets/json/AquariumHouse.json')

        // load audio
        this.load.audio('water_drop', 'assets/Audio/WaterDrop.mp3');
        this.load.audio('music', 'assets/Audio/Reality.mp3');
    }

    async create () {
        //makes map
        const mapHome = this.make.tilemap({ key: 'mapHome'})
        //assigns textures to tilesets
        const tileset = mapHome.addTilesetImage('aquarium','aquarium')
        const tileset2 = mapHome.addTilesetImage('bedroom','bedroom')
        const tileset3 = mapHome.addTilesetImage('borders','borders')
        const tileset4 = mapHome.addTilesetImage('fishingitems','fishingitems')
        const tileset5 = mapHome.addTilesetImage('floors','floors')
        const tileset6 = mapHome.addTilesetImage('genericfurniture','genericfurniture')
        const tileset7 = mapHome.addTilesetImage('kitchen','kitchen')
        const tileset8 = mapHome.addTilesetImage('livingroom','livingroom')
        const tileset9 = mapHome.addTilesetImage('walls','walls')
        //adds tilesets to layers
        const allLayers = [tileset, tileset2, tileset3, tileset4, tileset5, tileset6, tileset7, tileset8, tileset9]

        //creates layers
        var floor = mapHome.createLayer('Floor', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var walls = mapHome.createLayer('Walls', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var objs1 = mapHome.createLayer('Objs_1', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var objs2 = mapHome.createLayer('Objs_2', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var objs3 = mapHome.createLayer('Objs_3', allLayers, 0, 0).setScale(this.assetsScaleFactor)

        //adds character to map
        this.character = this.physics.add.sprite(90, 180, 'walking', 11);
        this.character.setSize(16, 5);

//        this.lineCast = true;

        //adds music
        this.waterDrop = this.sound.add('water_drop');
        this.music = this.sound.add('music');
        var musicConfig = {
          mute: false,
          volume: .1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
        }
//        this.music.play(musicConfig);

//        this.createUserInterface();

        // this.character.setOrigin(0.5, 1);

        //this.character.setCollideWorldBounds(true);
        //makes character collide with walls and items
        walls.setCollisionByProperty({ collides: true });
        objs1.setCollisionByProperty({ collides: true });
        objs2.setCollisionByProperty({ collides: true });
        objs3.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.character, walls);
        this.physics.add.collider(this.character, objs1);
        this.physics.add.collider(this.character, objs2);
        this.physics.add.collider(this.character, objs3);

        // this.character.setDepth(10);
        this.cameras.main.setZoom(1)
        this.cameras.main.startFollow(this.character);
        this.cameras.main.roundPixels = true;
        // this.cameras.main.zoom = 0.5;

        //walking right animation (EC)
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('walking', { frames: [12, 13, 14, 15] }),
            frameRate: 5,
        });

        //walking down animation (EC)
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('walking', { frames: [0, 1, 2, 3] }),
            frameRate: 5
        });

        //walking up animation (EC)
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('walking', { frames: [8, 9, 10, 11] }),
            frameRate: 5
        });

        //walking left animation (EC)
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('walking', { frames: [4, 5, 6, 7] }),
            frameRate: 5,
        });


        // this.anims.create({
        //     key: 'hookIconSwitch',
        //     frames: this.anims.generateFrameNumbers('uiContainers', { frames: [6] }),
        //     frameRate: 500,
        // });
        //
        // this.anims.create({
        //     key: 'hookIconSwitchBack',
        //     frames: this.anims.generateFrameNumbers('uiContainers', { frames: [0] }),
        //     frameRate: 500,
        // });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.fishCheck = false;

        //allows character to exit door
        this.houseDoor = this.physics.add.staticImage(90, 215, 'uiContainers', 0);
        this.houseDoor.visible = false;
        this.physics.add.overlap(this.houseDoor, this.character, function (){
            //OPEN NEW MAP HERE
            mainScene = true;
        });

        // this.input.keyboard.on('keydown-SPACE', function () {
        //     if(this.fishCheck == false && fishingPossible == true){
        //         this.fishCheck = true;
        //         fishingPossible = false;
        //         this.fish = this.add.sprite(Phaser.Math.Between(225, 245), Phaser.Math.Between(385, 405), 'fish', Phaser.Math.Between(18, 126));
        //
        //         this.time.addEvent({
        //             delay: Phaser.Math.Between(1500, 2000),
        //             callback: ()=>{
        //                 this.fish.visible = false;
        //                 this.fish.active = false;
        //                 this.fishCheck = false;
        //                 fishingPossible = false;
        //             },
        //             loop: false
        //         })
        //     }
        // }, this);

        if(this.initialX != undefined && this.initialY != undefined) {
            this.character.setX(this.initialX);
            this.character.setY(this.initialY);
        }

        if(this.inventory == undefined) {
            this.inventory = {};
        }
    }

    update (time, delta) {
        this.timer += delta;
        while (this.timer > 2000) {
            this.saveMoveToDB();
            this.saveInventoryToDB();
            this.timer -= 2000;
        }


        if(mainScene){
            mainScene = false;
            console.log("Start MainMap");
            this.saveMoveToDB('MainMap', 410, 158);
            this.scene.start('MainMap');
        }

        //console.log("update")
        this.character.setVelocityX(0);
        this.character.setVelocityY(0);
        //walk left when pressing left arrow key
        if (this.cursors.left.isDown){
            this.character.setVelocityX(-48);
            this.character.setSize(16,5);
            this.character.body.offset.y = 10;

            this.character.anims.play('left', true);
        }
        //walk right when pressing right arrow key
        else if (this.cursors.right.isDown){
            this.character.setVelocityX(48);
            this.character.setSize(16,5);
            this.character.body.offset.y = 10;

            this.character.anims.play('right', true);
        }
        //walk down when pressing down arrow key
        else if (this.cursors.down.isDown) {
            this.character.setVelocityY(48);
            this.character.setSize(16,5);
            this.character.body.offset.y = 10;

            this.character.anims.play('down', true);
        }
        //walk up when pressing up arrow key
        else if (this.cursors.up.isDown) {
            this.character.setVelocityY(-48);
            this.character.setSize(16,5);
            this.character.body.offset.y = 10;

            this.character.anims.play('up', true);
        }
    }

    // resetIcon1(){
    //     this.hookIcon2.play('hookIconSwitchBack');
    //     this.hookIcon3.play('hookIconSwitchBack');
    // }
    //
    // resetIcon2(){
    //     this.hookIcon1.play('hookIconSwitchBack');
    //     this.hookIcon3.play('hookIconSwitchBack');
    // }
    //
    // resetIcon3(){
    //     this.hookIcon2.play('hookIconSwitchBack');
    //     this.hookIcon1.play('hookIconSwitchBack');
    // }
    //
    // resetIcon4(){
    //     this.baitIcon2.play('hookIconSwitchBack');
    //     this.baitIcon3.play('hookIconSwitchBack');
    // }
    //
    // resetIcon5(){
    //     this.baitIcon1.play('hookIconSwitchBack');
    //     this.baitIcon3.play('hookIconSwitchBack');
    // }
    //
    // resetIcon6(){
    //     this.baitIcon2.play('hookIconSwitchBack');
    //     this.baitIcon1.play('hookIconSwitchBack');
    // }
    //
    // createUserInterface(){
    //
    //     //Background
    //     let x = 216;
    //     let y = 10;
    //     let w = 100;
    //     let h = 140;
    //
    //     this.interface  = this.add.graphics({x: x, y: y})
    //     this.border     = this.add.graphics({x: x, y: y})
    //
    //     this.interface.clear();
    //     this.interface.fillStyle('0x965D37', 1);
    //     this.interface.fillRect(0, 0, w, h);
    //     this.interface.fixedToCamera = true;
    //     this.interface.setScrollFactor(0);
    //
    //     this.border.clear();
    //     this.border.lineStyle(2, '0x4D6592', 1);
    //     this.border.strokeRect(0, 0, w, h);
    //     this.border.fixedToCamera = true;
    //     this.border.setScrollFactor(0)
    //
    //     this.invTitle = new Text(
    //         this,
    //         265,
    //         19,
    //         'Hooks',
    //         'userInterface',
    //         0.5
    //     );
    //     this.invTitle.fixedToCamera = true;
    //     this.invTitle.setScrollFactor(0);
    //
    //     this.hookIcon1 = this.add.sprite(236, 36, 'uiContainers', 0).setInteractive();
    //     this.hookIcon1.fixedToCamera = true;
    //     this.hookIcon1.setScrollFactor(0);
    //     this.hookIcon1.on('pointerdown', function (pointer){
    //         this.play('hookIconSwitch');
    //     });
    //     // Event handler for when the animation completes on our sprite
    //     this.hookIcon1.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
    //         this.resetIcon1();
    //     }, this);
    //
    //     this.hook1 = this.add.sprite(236, 36, 'baitAndHooks', 4);
    //     this.hook1.fixedToCamera = true;
    //     this.hook1.setScrollFactor(0);
    //
    //     this.hookIcon2 = this.add.sprite(266, 36, 'uiContainers', 0).setInteractive();
    //     this.hookIcon2.fixedToCamera = true;
    //     this.hookIcon2.setScrollFactor(0);
    //     this.hookIcon2.on('pointerdown', function (pointer){
    //         this.play('hookIconSwitch');
    //     });
    //     // Event handler for when the animation completes on our sprite
    //     this.hookIcon2.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
    //         this.resetIcon2();
    //     }, this);
    //
    //     this.hook2 = this.add.sprite(266, 36, 'baitAndHooks', 9);
    //     this.hook2.fixedToCamera = true;
    //     this.hook2.setScrollFactor(0);
    //
    //     this.hookIcon3 = this.add.sprite(295, 36, 'uiContainers', 0).setInteractive();
    //     this.hookIcon3.fixedToCamera = true;
    //     this.hookIcon3.setScrollFactor(0);
    //     this.hookIcon3.on('pointerdown', function (pointer){
    //         this.play('hookIconSwitch');
    //         //this.play('hookIconSwitchBack');
    //     });
    //     // Event handler for when the animation completes on our sprite
    //     this.hookIcon3.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
    //         this.resetIcon3();
    //     }, this);
    //
    //     this.hook3 = this.add.sprite(295, 36, 'baitAndHooks', 8);
    //     this.hook3.fixedToCamera = true;
    //     this.hook3.setScrollFactor(0)
    //
    //     this.invTitle = new Text(
    //         this,
    //         265,
    //         59,
    //         'Bait',
    //         'userInterface',
    //         0.5
    //     );
    //     this.invTitle.fixedToCamera = true;
    //     this.invTitle.setScrollFactor(0);
    //
    //     this.baitIcon1 = this.add.sprite(236, 76, 'uiContainers', 0).setInteractive();
    //     this.baitIcon1.fixedToCamera = true;
    //     this.baitIcon1.setScrollFactor(0);
    //     this.baitIcon1.on('pointerdown', function (pointer){
    //         this.play('hookIconSwitch');
    //     });
    //     // Event handler for when the animation completes on our sprite
    //     this.baitIcon1.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
    //         this.resetIcon4();
    //     }, this);
    //
    //     this.bait1 = this.add.sprite(236, 76, 'baitAndHooks', 0);
    //     this.bait1.fixedToCamera = true;
    //     this.bait1.setScrollFactor(0)
    //
    //     this.baitIcon2 = this.add.sprite(266, 76, 'uiContainers', 0).setInteractive();
    //     this.baitIcon2.fixedToCamera = true;
    //     this.baitIcon2.setScrollFactor(0);
    //     this.baitIcon2.on('pointerdown', function (pointer){
    //         this.play('hookIconSwitch');
    //     });
    //     // Event handler for when the animation completes on our sprite
    //     this.baitIcon2.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
    //         this.resetIcon5();
    //     }, this);
    //
    //     this.bait2 = this.add.sprite(266, 76, 'baitAndHooks', 1);
    //     this.bait2.fixedToCamera = true;
    //     this.bait2.setScrollFactor(0)
    //
    //     this.baitIcon3 = this.add.sprite(295, 76, 'uiContainers', 0).setInteractive();
    //     this.baitIcon3.fixedToCamera = true;
    //     this.baitIcon3.setScrollFactor(0);
    //     this.baitIcon3.on('pointerdown', function (pointer){
    //         this.play('hookIconSwitch');
    //     });
    //     // Event handler for when the animation completes on our sprite
    //     this.baitIcon3.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
    //         this.resetIcon6();
    //     }, this);
    //
    //     this.invTitle = new Text(
    //         this,
    //         265,
    //         94,
    //         'Inventory',
    //         'userInterface',
    //         0.5
    //     );
    //     this.invTitle.fixedToCamera = true;
    //     this.invTitle.setScrollFactor(0);
    //
    //     this.bait3 = this.add.sprite(295, 76, 'baitAndHooks', 2);
    //     this.bait3.fixedToCamera = true;
    //     this.bait3.setScrollFactor(0)
    //
    //     this.inventory1 = this.add.sprite(231, 136, 'uiContainers', 24);
    //     this.inventory1.fixedToCamera = true;
    //     this.inventory1.setScrollFactor(0)
    //
    //     this.inventory1 = this.add.sprite(254, 136, 'uiContainers', 24);
    //     this.inventory1.fixedToCamera = true;
    //     this.inventory1.setScrollFactor(0)
    //
    //     this.inventory1 = this.add.sprite(277, 136, 'uiContainers', 24);
    //     this.inventory1.fixedToCamera = true;
    //     this.inventory1.setScrollFactor(0)
    //
    //     this.inventory1 = this.add.sprite(300, 136, 'uiContainers', 24);
    //     this.inventory1.fixedToCamera = true;
    //     this.inventory1.setScrollFactor(0)
    //
    //     this.inventory2 = this.add.sprite(231, 112, 'uiContainers', 24);
    //     this.inventory2.fixedToCamera = true;
    //     this.inventory2.setScrollFactor(0)
    //
    //     this.inventory1 = this.add.sprite(254, 112, 'uiContainers', 24);
    //     this.inventory1.fixedToCamera = true;
    //     this.inventory1.setScrollFactor(0)
    //
    //     this.inventory1 = this.add.sprite(277, 112, 'uiContainers', 24);
    //     this.inventory1.fixedToCamera = true;
    //     this.inventory1.setScrollFactor(0)
    //
    //     this.inventory1 = this.add.sprite(300, 112, 'uiContainers', 24);
    //     this.inventory1.fixedToCamera = true;
    //     this.inventory1.setScrollFactor(0)
    // }

    getSceneName() {
        return "AquariumHouse";
    }

    saveMoveToDB(newScene = this.getSceneName(), x = this.character.x, y = this.character.y) {
        axios.post('/api/move', {
            playerX: x,
            playerY: y,
            currentScene: newScene
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    saveInventoryToDB(inventory = this.inventory) {
        axios.post('/api/inventory', {
            inventory: inventory
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    async getMoveFromDB() {
        const response = await axios.get('/api/move')
        return response.data
    }
}
