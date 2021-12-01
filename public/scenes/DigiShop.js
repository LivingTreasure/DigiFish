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
var fishShop1
var fishShop2
var fishShop3
var fishShop4
var fishShop5
var fishShop6
var fishShop7
var fishShop8
var shopFish1
var shopFish2
var shopFish3
var shopFish4
var shopFish5
var shopFish6
var shopFish7
var shopFish8
var fishSell1
var fishSell2
var fishSell3
var fishSell4
var fishSell5
var fishSell6
var fishSell7
var fishSell8
var invFish1
var invFish2
var invFish3
var invFish4
var invFish5
var invFish6
var invFish7
var invFish8

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
        this.load.audio('cash_register', 'assets/Audio/CashRegister.mp3');
        this.load.audio('music', 'assets/Audio/Store.mp3');
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
        this.cashRegister = this.sound.add('cash_register');
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
        this.music.play(musicConfig);

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

        if(this.initialX != undefined && this.initialY != undefined) {
            this.character.setX(this.initialX);
            this.character.setY(this.initialY);
        }

        this.input.on('gameobjectup', function (pointer, gameObject){
            gameObject.emit('clicked', gameObject);
        }, this);

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

        shopTitle = new Text(
            this,
            100,
            20,
            'Shop',
            'userInterface',
            0.5
        );
        shopTitle.fixedToCamera = true;
        shopTitle.setScrollFactor(0);
        shopTitle.setText();


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

        fishShop1 = this.add.sprite(35, 50, 'uiContainers', 24);
        fishShop2 = this.add.sprite(35, 90, 'uiContainers', 24);
        fishShop3 = this.add.sprite(80, 50, 'uiContainers', 24);
        fishShop4 = this.add.sprite(80, 90, 'uiContainers', 24);
        fishShop5 = this.add.sprite(125, 50, 'uiContainers', 24);
        fishShop6 = this.add.sprite(125, 90, 'uiContainers', 24);
        fishShop7 = this.add.sprite(170, 50, 'uiContainers', 24);
        fishShop8 = this.add.sprite(170, 90, 'uiContainers', 24);

        fishShop1.fixedToCamera = true;
        fishShop1.setScrollFactor(0)
        fishShop2.fixedToCamera = true;
        fishShop2.setScrollFactor(0)
        fishShop3.fixedToCamera = true;
        fishShop3.setScrollFactor(0)
        fishShop4.fixedToCamera = true;
        fishShop4.setScrollFactor(0)
        fishShop5.fixedToCamera = true;
        fishShop5.setScrollFactor(0)
        fishShop6.fixedToCamera = true;
        fishShop6.setScrollFactor(0)
        fishShop7.fixedToCamera = true;
        fishShop7.setScrollFactor(0)
        fishShop8.fixedToCamera = true;
        fishShop8.setScrollFactor(0)

        fishShop1.visible = false;
        fishShop2.visible = false;
        fishShop3.visible = false;
        fishShop4.visible = false;
        fishShop5.visible = false;
        fishShop6.visible = false;
        fishShop7.visible = false;
        fishShop8.visible = false;

        fishSell1 = this.add.sprite(38, 30, 'coin', 11);
        fishSell2 = this.add.sprite(38, 70, 'coin', 11);
        fishSell3 = this.add.sprite(82, 30, 'coin', 11);
        fishSell4 = this.add.sprite(82, 70, 'coin', 11);
        fishSell5 = this.add.sprite(127, 30, 'coin', 11);
        fishSell6 = this.add.sprite(127, 70, 'coin', 11);
        fishSell7 = this.add.sprite(172, 30, 'coin', 11);
        fishSell8 = this.add.sprite(172, 70, 'coin', 11);

        fishSell1.fixedToCamera = true;
        fishSell1.setScrollFactor(0);
        fishSell2.fixedToCamera = true;
        fishSell2.setScrollFactor(0);
        fishSell3.fixedToCamera = true;
        fishSell3.setScrollFactor(0);
        fishSell4.fixedToCamera = true;
        fishSell4.setScrollFactor(0);
        fishSell5.fixedToCamera = true;
        fishSell5.setScrollFactor(0);
        fishSell6.fixedToCamera = true;
        fishSell6.setScrollFactor(0);
        fishSell7.fixedToCamera = true;
        fishSell7.setScrollFactor(0);
        fishSell8.fixedToCamera = true;
        fishSell8.setScrollFactor(0);

        fishSell1.visible = false;
        fishSell2.visible = false;
        fishSell3.visible = false;
        fishSell4.visible = false;
        fishSell5.visible = false;
        fishSell6.visible = false;
        fishSell7.visible = false;
        fishSell8.visible = false;

        fishSell1.setInteractive();
        fishSell1.on('clicked', this.sellOne, this);

        fishSell2.setInteractive();
        fishSell2.on('clicked', this.sellTwo, this);

        fishSell3.setInteractive();
        fishSell3.on('clicked', this.sellThree, this);

        fishSell4.setInteractive();
        fishSell4.on('clicked', this.sellFour, this);

        fishSell5.setInteractive();
        fishSell5.on('clicked', this.sellFive, this);

        fishSell6.setInteractive();
        fishSell6.on('clicked', this.sellSix, this);

        fishSell7.setInteractive();
        fishSell7.on('clicked', this.sellSeven, this);

        fishSell8.setInteractive();
        fishSell8.on('clicked', this.sellEight, this);

        //this is checking if the inventory is empty upon load and fills it if something exists within the database
        if(this.inventory == undefined) {
            this.inventory = [];
        }else{
            this.fillInventory();
        }


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
            this.saveMoveToDB('MainMap', 210, 160);
            this.scene.start('MainMap', {x:210, y:160});
            //this reload is needed to refresh the database
            window.location.reload();
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
            shopTitle.setText();
            fishShop1.visible = false;
            fishShop2.visible = false;
            fishShop3.visible = false;
            fishShop4.visible = false;
            fishShop5.visible = false;
            fishShop6.visible = false;
            fishShop7.visible = false;
            fishShop8.visible = false;

            if(this.inventory['0'] != null){
                shopFish1.visible = false;
            }

            if(this.inventory['1'] != null){
                shopFish2.visible = false;
            }

            if(this.inventory['2'] != null){
                shopFish3.visible = false;
            }

            if(this.inventory['3'] != null){
                shopFish4.visible = false;
            }

            if(this.inventory['4'] != null){
                shopFish5.visible = false;
            }

            if(this.inventory['5'] != null){
                shopFish6.visible = false;
            }

            if(this.inventory['6'] != null){
                shopFish7.visible = false;
            }

            if(this.inventory['7'] != null){
                shopFish8.visible = false;
            }

            fishSell1.visible = false;
            fishSell2.visible = false;
            fishSell3.visible = false;
            fishSell4.visible = false;
            fishSell5.visible = false;
            fishSell6.visible = false;
            fishSell7.visible = false;
            fishSell8.visible = false;
        }else{
            border.visible = true;
            closeShop.visible = true;
            shopBackground.visible = true;
            shopTitle.setShop();
            fishShop1.visible = true;
            fishShop2.visible = true;
            fishShop3.visible = true;
            fishShop4.visible = true;
            fishShop5.visible = true;
            fishShop6.visible = true;
            fishShop7.visible = true;
            fishShop8.visible = true;

            if(this.inventory['0'] != null){
                shopFish1.visible = true;
            }

            if(this.inventory['1'] != null){
                shopFish2.visible = true;
            }

            if(this.inventory['2'] != null){
                shopFish3.visible = true;
            }

            if(this.inventory['3'] != null){
                shopFish4.visible = true;
            }

            if(this.inventory['4'] != null){
                shopFish5.visible = true;
            }

            if(this.inventory['5'] != null){
                shopFish6.visible = true;
            }

            if(this.inventory['6'] != null){
                shopFish7.visible = true;
            }

            if(this.inventory['7'] != null){
                shopFish8.visible = true;
            }

            fishSell1.visible = true;
            fishSell2.visible = true;
            fishSell3.visible = true;
            fishSell4.visible = true;
            fishSell5.visible = true;
            fishSell6.visible = true;
            fishSell7.visible = true;
            fishSell8.visible = true;

        }
    }

    clickHandler(closeShop){
        activeShop = false;
        this.createShopInterface();
    }

    sellOne(sellFish1){
        this.cashRegister.play();
        this.inventory['0'] = null;
        shopFish1.visible = false;
        invFish1.visible = false;
        this.saveInventoryToDB();
    }

    sellTwo(sellFish2){
        this.cashRegister.play();
        this.inventory['1'] = null;
        shopFish2.visible = false;
        invFish2.visible = false;
        this.saveInventoryToDB();
    }

    sellThree(sellFish3){
        this.cashRegister.play();
        this.inventory['2'] = null;
        shopFish3.visible = false;
        invFish3.visible = false;
        this.saveInventoryToDB();
    }

    sellFour(sellFish1){
        this.cashRegister.play();
        this.inventory['3'] = null;
        shopFish4.visible = false;
        invFish4.visible = false;
        this.saveInventoryToDB();
    }

    sellFive(sellFish1){
        this.cashRegister.play();
        this.inventory['4'] = null;
        shopFish5.visible = false;
        invFish5.visible = false;
        this.saveInventoryToDB();
    }

    sellSix(sellFish1){
        this.cashRegister.play();
        this.inventory['5'] = null;
        shopFish6.visible = false;
        invFish6.visible = false;
        this.saveInventoryToDB();
    }

    sellSeven(sellFish1){
        this.cashRegister.play();
        this.inventory['6'] = null;
        shopFish7.visible = false;
        invFish7.visible = false;
        this.saveInventoryToDB();
    }

    sellEight(sellFish1){
        this.cashRegister.play();
        this.inventory['7'] = null;
        shopFish8.visible = false;
        invFish8.visible = false;
        this.saveInventoryToDB();
    }

    //this function loops through all the database items and calls the function to load them
    fillInventory(){
        this.arrayLength = this.inventory.length;
        for (var i = 0; i < this.arrayLength; i++) {
            if(this.inventory[i] != undefined){
                this.addFishToInventory(this.inventory[i]); // call add sprite method here
                this.addFishToShop(this.inventory[i]); // call add sprite method here
            }
        }
    }

    //reloads inventory from database
    addFishToInventory(dbFish){
        if(this.inventory['0'] === dbFish){
            invFish1 = this.add.sprite(231, 112, 'fish', dbFish);
            invFish1.fixedToCamera = true;
            invFish1.setScrollFactor(0)

        }else if(this.inventory['1'] === dbFish){
            invFish2 = this.add.sprite(254, 112, 'fish', dbFish);
            invFish2.fixedToCamera = true;
            invFish2.setScrollFactor(0)

        }else if(this.inventory['2'] === dbFish){
            invFish3 = this.add.sprite(277, 112, 'fish', dbFish);
            invFish3.fixedToCamera = true;
            invFish3.setScrollFactor(0)

        }else if(this.inventory['3'] === dbFish){
            invFish4 = this.add.sprite(300, 112, 'fish', dbFish);
            invFish4.fixedToCamera = true;
            invFish4.setScrollFactor(0)

        }else if(this.inventory['4'] === dbFish){
            invFish5 = this.add.sprite(231, 136, 'fish', dbFish);
            invFish5.fixedToCamera = true;
            invFish5.setScrollFactor(0)

        }else if(this.inventory['5'] === dbFish){
            invFish6 = this.add.sprite(254, 136, 'fish', dbFish);
            invFish6.fixedToCamera = true;
            invFish6.setScrollFactor(0)

        }else if(this.inventory['6'] === dbFish){
            invFish7 = this.add.sprite(277, 136, 'fish', dbFish);
            invFish7.fixedToCamera = true;
            invFish7.setScrollFactor(0)

        }else if(this.inventory['7'] === dbFish){
            invFish8 = this.add.sprite(300, 136, 'fish', dbFish);
            invFish8.fixedToCamera = true;
            invFish8.setScrollFactor(0)

        }

    }

    //reloads shop from database
    addFishToShop(dbFish){
        if(this.inventory['0'] === dbFish){
            shopFish1 = this.add.sprite(35, 50, 'fish', dbFish);
            shopFish1.visible = false;
            shopFish1.fixedToCamera = true;
            shopFish1.setScrollFactor(0)

        }else if(this.inventory['1'] === dbFish){
            shopFish2 = this.add.sprite(35, 90, 'fish', dbFish);
            shopFish2.visible = false;
            shopFish2.fixedToCamera = true;
            shopFish2.setScrollFactor(0)

        }else if(this.inventory['2'] === dbFish){
            shopFish3 = this.add.sprite(80, 50, 'fish', dbFish);
            shopFish3.visible = false;
            shopFish3.fixedToCamera = true;
            shopFish3.setScrollFactor(0)

        }else if(this.inventory['3'] === dbFish){
            shopFish4 = this.add.sprite(80, 90, 'fish', dbFish);
            shopFish4.visible = false;
            shopFish4.fixedToCamera = true;
            shopFish4.setScrollFactor(0)

        }else if(this.inventory['4'] === dbFish){
            shopFish5 = this.add.sprite(125, 50, 'fish', dbFish);
            shopFish5.visible = false;
            shopFish5.fixedToCamera = true;
            shopFish5.setScrollFactor(0)

        }else if(this.inventory['5'] === dbFish){
            shopFish6 = this.add.sprite(125, 90, 'fish', dbFish);
            shopFish6.visible = false;
            shopFish6.fixedToCamera = true;
            shopFish6.setScrollFactor(0)

        }else if(this.inventory['6'] === dbFish){
            shopFish7 = this.add.sprite(170, 50, 'fish', dbFish);
            shopFish7.visible = false;
            shopFish7.fixedToCamera = true;
            shopFish7.setScrollFactor(0)

        }else if(this.inventory['7'] === dbFish){
            shopFish8 = this.add.sprite(170, 90, 'fish', dbFish);
            shopFish8.visible = false;
            shopFish8.fixedToCamera = true;
            shopFish8.setScrollFactor(0)

        }

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
