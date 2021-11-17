var timedEvent;
var text;
var fishingPossible = false;
var mainScene = false;
var houseScene = false;
var initialX;
var initialY;
var inventory;
var activeShop = false;
var ShopInterface = false;
var closeShop;
var shopBackground;
var border;
var shopTitle;

class DigiShop extends Phaser.Scene {
    //THIS SCENE IS THE SHOP SCREEN
    constructor () {

        super({key: 'DigiShop', active: false})
    }

    init (data) {
        console.log("Start DigiShop")

        this.CONFIG = this.sys.game.CONFIG;
        this.timer = 0;

        this.initialX = data.x;
        this.initialY = data.y;
        this.inventory = data.inventory;
    }

    preload () {
        //loads textures
        this.load.image('generic', 'assets/images/Modern_Interiors/Theme_Sorter/1_Generic_16x16.png')
        this.load.image('grocery', 'assets/images/Modern_Interiors/Theme_Sorter/16_Grocery_store_16x16.png')
        this.load.image('turtle', 'assets/characters/TurtleForTable.png')
        this.load.image('fishingitems', 'assets/images/Modern_Interiors/Theme_Sorter/9_Fishing_16x16.png')
        this.load.spritesheet('character', 'assets/characters/char1_fishingrod_animation_32x32.png', {
            frameWidth: 32,
            frameHeight: 32
        })

        // load the JSON file
        this.load.tilemapTiledJSON('mapStore', 'assets/json/DigiShop.json')

        // load audio
        this.load.audio('water_drop', 'assets/Audio/WaterDrop.mp3');
        this.load.audio('music', 'assets/Audio/Reality.mp3');
    }

    async create () {
        //makes map
        const mapStore = this.make.tilemap({ key: 'mapStore'})
        //assigns textures to tilesets
        const tileset = mapStore.addTilesetImage('TurtleForTable','turtle')
        const tileset2 = mapStore.addTilesetImage('16_Grocery_store_16x16','grocery')
        const tileset3 = mapStore.addTilesetImage('1_Generic_16x16','generic')
        const tileset4 = mapStore.addTilesetImage('9_Fishing_16x16','fishingitems')

        //adds tilesets to layers
        const allLayers = [tileset, tileset2, tileset3, tileset4]

        //creates layers
        var backGround = mapStore.createLayer('BackGround', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var walls = mapStore.createLayer('Walls', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var shelves = mapStore.createLayer('Shelves', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var objects = mapStore.createLayer('Objects', allLayers, 0, 0).setScale(this.assetsScaleFactor)

        //adds character to map
        this.character = this.physics.add.sprite(160, 160, 'walking', 11);
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

       this.createUserInterface();

        // this.character.setOrigin(0.5, 1);

        //this.character.setCollideWorldBounds(true);
        //makes character collide with walls and items
        walls.setCollisionByProperty({ collides: true });
        backGround.setCollisionByProperty({ collides: true });
        shelves.setCollisionByProperty({ collides: true });
        objects.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.character, walls);
        this.physics.add.collider(this.character, backGround);
        this.physics.add.collider(this.character, shelves);
        this.physics.add.collider(this.character, objects);

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


        this.anims.create({
            key: 'hookIconSwitch',
            frames: this.anims.generateFrameNumbers('uiContainers', { frames: [6] }),
            frameRate: 500,
        });

        this.anims.create({
            key: 'hookIconSwitchBack',
            frames: this.anims.generateFrameNumbers('uiContainers', { frames: [0] }),
            frameRate: 500,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.fishCheck = false;

        //allows character to exit door
        this.shopDoor = this.physics.add.staticImage(160, 188, 'uiContainers', 0);
        this.shopDoor.visible = false;
        this.physics.add.overlap(this.shopDoor, this.character, function (){
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

        this.input.on('gameobjectup', function (pointer, gameObject){
            gameObject.emit('clicked', gameObject);
        }, this);

        //this is checking if the inventory is empty upon load and fills it if something exists within the database
        if(this.inventory == undefined) {
            this.inventory = [];
        }else{
            this.fillInventory();
        }

        this.shop = this.physics.add.staticImage(195, 88, 'uiContainers', 0);
        this.shop.visible = false;
        this.physics.add.overlap(this.shop, this.character, function (){
            //Create shop interface
            ShopInterface = true;
            activeShop = true;
        });

        //BUILDS SHOP
        let x = 5;
        let y = 10;
        let w = 200;
        let h = 100;

        shopBackground   = this.add.graphics({x: x, y: y})
        border          = this.add.graphics({x: x, y: y})

        closeShop = this.add.sprite(205, 10, 'guiIcons', 27);
        closeShop.setInteractive();
        closeShop.on('clicked', this.clickHandler, this);
        closeShop.visible = false;

        closeShop.fixedToCamera = true;
        closeShop.setScrollFactor(0);

        this.shopTitle = new Text(
            this,
            100,
            20,
            'Shop',
            'userInterface',
            0.5
        );
        this.shopTitle.fixedToCamera = true;
        this.shopTitle.setScrollFactor(0);


        shopBackground.clear();
        shopBackground.fillStyle('0x965D37', 1);
        shopBackground.fillRect(0, 0, w, h);
        shopBackground.fixedToCamera = true;
        shopBackground.setScrollFactor(0);
        shopBackground.visible = false;

        border.clear();
        border.lineStyle(2, '0x4D6592', 1);
        border.strokeRect(0, 0, w, h);
        border.fixedToCamera = true;
        border.setScrollFactor(0)
        border.visible = false;
    }

    update (time, delta) {

        if(ShopInterface){
            this.createShopInterface();
        }

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

    createShopInterface(){
        if(!activeShop){
            border.visible = false;
            closeShop.visible = false;
            shopBackground.visible = false;
        }else{
            border.visible = true;
            closeShop.visible = true;
            shopBackground.visible = true;
        }
    }

    clickHandler(closeShop){
        activeShop = false;
        this.createShopInterface();
    }

    //this function loops through all the database items and calls the function to load them
    fillInventory(){
        this.arrayLength = this.inventory.length;
        for (var i = 0; i < this.arrayLength; i++) {
            if(this.inventory[i] != undefined){
                this.addFishToInventory(this.inventory[i]); // call add sprite method here
            }
        }
    }

    //reloads inventory from database
    addFishToInventory(dbFish){
        if(this.inventory['0'] === dbFish){
            this.caughtFish = this.add.sprite(231, 112, 'fish', dbFish);

        }else if(this.inventory['1'] === dbFish){
            this.caughtFish = this.add.sprite(254, 112, 'fish', dbFish);

        }else if(this.inventory['2'] === dbFish){
            this.caughtFish = this.add.sprite(277, 112, 'fish', dbFish);

        }else if(this.inventory['3'] === dbFish){
            this.caughtFish = this.add.sprite(300, 112, 'fish', dbFish);

        }else if(this.inventory['4'] === dbFish){
            this.caughtFish = this.add.sprite(231, 136, 'fish', dbFish);

        }else if(this.inventory['5'] === dbFish){
            this.caughtFish = this.add.sprite(254, 136, 'fish', dbFish);

        }else if(this.inventory['6'] === dbFish){
            this.caughtFish = this.add.sprite(277, 136, 'fish', dbFish);

        }else if(this.inventory['7'] === dbFish){
            this.caughtFish = this.add.sprite(300, 136, 'fish', dbFish);

        }

        this.caughtFish.fixedToCamera = true;
        this.caughtFish.setScrollFactor(0)

    }

    resetIcon1(){
        this.hookIcon2.play('hookIconSwitchBack');
        this.hookIcon3.play('hookIconSwitchBack');
    }

    resetIcon2(){
        this.hookIcon1.play('hookIconSwitchBack');
        this.hookIcon3.play('hookIconSwitchBack');
    }

    resetIcon3(){
        this.hookIcon2.play('hookIconSwitchBack');
        this.hookIcon1.play('hookIconSwitchBack');
    }

    resetIcon4(){
        this.baitIcon2.play('hookIconSwitchBack');
        this.baitIcon3.play('hookIconSwitchBack');
    }

    resetIcon5(){
        this.baitIcon1.play('hookIconSwitchBack');
        this.baitIcon3.play('hookIconSwitchBack');
    }

    resetIcon6(){
        this.baitIcon2.play('hookIconSwitchBack');
        this.baitIcon1.play('hookIconSwitchBack');
    }

    createUserInterface(){

        //Background
        let x = 216;
        let y = 10;
        let w = 100;
        let h = 140;

        this.interface  = this.add.graphics({x: x, y: y})
        this.border     = this.add.graphics({x: x, y: y})

        this.interface.clear();
        this.interface.fillStyle('0x965D37', 1);
        this.interface.fillRect(0, 0, w, h);
        this.interface.fixedToCamera = true;
        this.interface.setScrollFactor(0);

        this.border.clear();
        this.border.lineStyle(2, '0x4D6592', 1);
        this.border.strokeRect(0, 0, w, h);
        this.border.fixedToCamera = true;
        this.border.setScrollFactor(0)

        this.invTitle = new Text(
            this,
            265,
            19,
            'Hooks',
            'userInterface',
            0.5
        );
        this.invTitle.fixedToCamera = true;
        this.invTitle.setScrollFactor(0);

        this.hookIcon1 = this.add.sprite(236, 36, 'uiContainers', 0).setInteractive();
        this.hookIcon1.fixedToCamera = true;
        this.hookIcon1.setScrollFactor(0);
        this.hookIcon1.on('pointerdown', function (pointer){
            this.play('hookIconSwitch');
        });
        // Event handler for when the animation completes on our sprite
        this.hookIcon1.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
            this.resetIcon1();
        }, this);

        this.hook1 = this.add.sprite(236, 36, 'baitAndHooks', 4);
        this.hook1.fixedToCamera = true;
        this.hook1.setScrollFactor(0);

        this.hookIcon2 = this.add.sprite(266, 36, 'uiContainers', 0).setInteractive();
        this.hookIcon2.fixedToCamera = true;
        this.hookIcon2.setScrollFactor(0);
        this.hookIcon2.on('pointerdown', function (pointer){
            this.play('hookIconSwitch');
        });
        // Event handler for when the animation completes on our sprite
        this.hookIcon2.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
            this.resetIcon2();
        }, this);

        this.hook2 = this.add.sprite(266, 36, 'baitAndHooks', 9);
        this.hook2.fixedToCamera = true;
        this.hook2.setScrollFactor(0);

        this.hookIcon3 = this.add.sprite(295, 36, 'uiContainers', 0).setInteractive();
        this.hookIcon3.fixedToCamera = true;
        this.hookIcon3.setScrollFactor(0);
        this.hookIcon3.on('pointerdown', function (pointer){
            this.play('hookIconSwitch');
            //this.play('hookIconSwitchBack');
        });
        // Event handler for when the animation completes on our sprite
        this.hookIcon3.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
            this.resetIcon3();
        }, this);

        this.hook3 = this.add.sprite(295, 36, 'baitAndHooks', 8);
        this.hook3.fixedToCamera = true;
        this.hook3.setScrollFactor(0)

        this.invTitle = new Text(
            this,
            265,
            59,
            'Bait',
            'userInterface',
            0.5
        );
        this.invTitle.fixedToCamera = true;
        this.invTitle.setScrollFactor(0);

        this.baitIcon1 = this.add.sprite(236, 76, 'uiContainers', 0).setInteractive();
        this.baitIcon1.fixedToCamera = true;
        this.baitIcon1.setScrollFactor(0);
        this.baitIcon1.on('pointerdown', function (pointer){
            this.play('hookIconSwitch');
        });
        // Event handler for when the animation completes on our sprite
        this.baitIcon1.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
            this.resetIcon4();
        }, this);

        this.bait1 = this.add.sprite(236, 76, 'baitAndHooks', 0);
        this.bait1.fixedToCamera = true;
        this.bait1.setScrollFactor(0)

        this.baitIcon2 = this.add.sprite(266, 76, 'uiContainers', 0).setInteractive();
        this.baitIcon2.fixedToCamera = true;
        this.baitIcon2.setScrollFactor(0);
        this.baitIcon2.on('pointerdown', function (pointer){
            this.play('hookIconSwitch');
        });
        // Event handler for when the animation completes on our sprite
        this.baitIcon2.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
            this.resetIcon5();
        }, this);

        this.bait2 = this.add.sprite(266, 76, 'baitAndHooks', 1);
        this.bait2.fixedToCamera = true;
        this.bait2.setScrollFactor(0)

        this.baitIcon3 = this.add.sprite(295, 76, 'uiContainers', 0).setInteractive();
        this.baitIcon3.fixedToCamera = true;
        this.baitIcon3.setScrollFactor(0);
        this.baitIcon3.on('pointerdown', function (pointer){
            this.play('hookIconSwitch');
        });
        // Event handler for when the animation completes on our sprite
        this.baitIcon3.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hookIconSwitch', function () {
            this.resetIcon6();
        }, this);

        this.invTitle = new Text(
            this,
            265,
            94,
            'Inventory',
            'userInterface',
            0.5
        );
        this.invTitle.fixedToCamera = true;
        this.invTitle.setScrollFactor(0);

        this.bait3 = this.add.sprite(295, 76, 'baitAndHooks', 2);
        this.bait3.fixedToCamera = true;
        this.bait3.setScrollFactor(0)

        this.inventory1 = this.add.sprite(231, 136, 'uiContainers', 24);
        this.inventory1.fixedToCamera = true;
        this.inventory1.setScrollFactor(0)

        this.inventory1 = this.add.sprite(254, 136, 'uiContainers', 24);
        this.inventory1.fixedToCamera = true;
        this.inventory1.setScrollFactor(0)

        this.inventory1 = this.add.sprite(277, 136, 'uiContainers', 24);
        this.inventory1.fixedToCamera = true;
        this.inventory1.setScrollFactor(0)

        this.inventory1 = this.add.sprite(300, 136, 'uiContainers', 24);
        this.inventory1.fixedToCamera = true;
        this.inventory1.setScrollFactor(0)

        this.inventory2 = this.add.sprite(231, 112, 'uiContainers', 24);
        this.inventory2.fixedToCamera = true;
        this.inventory2.setScrollFactor(0)

        this.inventory1 = this.add.sprite(254, 112, 'uiContainers', 24);
        this.inventory1.fixedToCamera = true;
        this.inventory1.setScrollFactor(0)

        this.inventory1 = this.add.sprite(277, 112, 'uiContainers', 24);
        this.inventory1.fixedToCamera = true;
        this.inventory1.setScrollFactor(0)

        this.inventory1 = this.add.sprite(300, 112, 'uiContainers', 24);
        this.inventory1.fixedToCamera = true;
        this.inventory1.setScrollFactor(0)
    }

    getSceneName() {
        return "DigiShop";
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
            //console.log(response);
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
