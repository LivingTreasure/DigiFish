var timedEvent;
var text;
var fishingPossible = false;
var mainScene = false;
var shopScene = false;
var initialX;
var initialY;
var inventory;
var aquariumInterface = false;
var border;
var Aquainterface;
var closeAquarium;
var activeAquarium = true;
var fish1;
var fish2;
var fish3;
var fish4;
var fish6;
var fish5;
var fish7;
var fish8;
var refresh = false;



class AquariumHouse extends Phaser.Scene {
    //THIS SCENE IS THE HOUSE SCREEN
    constructor () {

        super({key: 'AquariumHouse', active: false})
    }

    init (data) {
        console.log("Start AquariumHouse")

        this.CONFIG = this.sys.game.CONFIG;
        this.timer = 0;

        console.log("check inv2: " + this.inventory);

        this.initialX = data.x;
        this.initialY = data.y;
        this.inventory = data.inventory;

        console.log("check inv: " + this.inventory);
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
        this.load.audio('music', 'assets/Audio/HouseMusic.mp3');
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

        //adds music
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
        if(musicPlaying == false){
            this.music.play(musicConfig);
            musicPlaying = true;
        }

        //makes character collide with walls and items
        walls.setCollisionByProperty({ collides: true });
        objs1.setCollisionByProperty({ collides: true });
        objs2.setCollisionByProperty({ collides: true });
        objs3.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.character, walls);
        this.physics.add.collider(this.character, objs1);
        this.physics.add.collider(this.character, objs2);
        this.physics.add.collider(this.character, objs3);

        this.cameras.main.setZoom(1)
        this.cameras.main.startFollow(this.character);
        this.cameras.main.roundPixels = true;

        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('fish', { frames: [123, 124] }),
            frameRate: 5,
        });

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

        //allows character to interact with aquarium
        this.aquarium = this.physics.add.staticImage(140, 35, 'uiContainers', 0);
        this.aquarium.visible = false;
        this.physics.add.overlap(this.aquarium, this.character, function (){
            //Create aquarium interface
            aquariumInterface = true;
            activeAquarium = true;
        });

        if(this.initialX != undefined && this.initialY != undefined) {
            this.character.setX(this.initialX);
            this.character.setY(this.initialY);
        }

        this.input.on('gameobjectup', function (pointer, gameObject){
            gameObject.emit('clicked', gameObject);
        }, this);



        //BUILDS AQUARIUM
        let x = 60;
        let y = 30;
        let w = 200;
        let h = 100;

        Aquainterface   = this.add.graphics({x: x, y: y})
        border          = this.add.graphics({x: x, y: y})

        closeAquarium = this.add.sprite(260, 30, 'guiIcons', 27);
        closeAquarium.setInteractive();
        closeAquarium.on('clicked', this.clickHandler, this);
        closeAquarium.visible = false;

        closeAquarium.fixedToCamera = true;
        closeAquarium.setScrollFactor(0);

        Aquainterface.clear();
        Aquainterface.fillStyle('0x4D6592', 1);
        Aquainterface.fillRect(0, 0, w, h);
        Aquainterface.fixedToCamera = true;
        Aquainterface.setScrollFactor(0);
        Aquainterface.visible = false;

        border.clear();
        border.lineStyle(2, '0x965D37', 1);
        border.strokeRect(0, 0, w, h);
        border.fixedToCamera = true;
        border.setScrollFactor(0)
        border.visible = false;

        //fish1 = this.physics.add.sprite(140, 35, 'fish', 123);
        //fish1.visible = false;

        if(this.inventory == undefined) {
            console.log("undef: " + this.inventory);
            //this.inventory = [];
        }else{
            console.log("def inv: " + this.inventory);
            this.fillInventory();
        }
    }

    update (time, delta) {

        if(aquariumInterface){
            this.createAquariumInterface();
        }

        this.timer += delta;
        while (this.timer > 2000) {
            this.saveMoveToDB();
            //this.saveInventoryToDB();
            this.timer -= 2000;
        }


        if(mainScene){
            mainScene = false;
            console.log("Start MainMap");
            this.saveMoveToDB('MainMap', 410, 158);
            this.scene.start('MainMap');
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
            aquariumInterface = false;
            activeAquarium = false;
        }
        //walk right when pressing right arrow key
        else if (this.cursors.right.isDown){
            this.character.setVelocityX(48);
            this.character.setSize(16,5);
            this.character.body.offset.y = 10;

            this.character.anims.play('right', true);
            aquariumInterface = false;
            activeAquarium = false;
        }
        //walk down when pressing down arrow key
        else if (this.cursors.down.isDown) {
            this.character.setVelocityY(48);
            this.character.setSize(16,5);
            this.character.body.offset.y = 10;

            this.character.anims.play('down', true);
            aquariumInterface = false;
            activeAquarium = false;
        }
        //walk up when pressing up arrow key
        else if (this.cursors.up.isDown) {
            this.character.setVelocityY(-48);
            this.character.setSize(16,5);
            this.character.body.offset.y = 10;

            this.character.anims.play('up', true);
            aquariumInterface = false;
            activeAquarium = false;
        }

    }

    createAquariumInterface(){

        if(!activeAquarium){
            border.visible = false;
            closeAquarium.visible = false;
            Aquainterface.visible = false;

            if(fish1 !== undefined){
                fish1.visible = false;
            }
            if(fish2 !== undefined){
                fish2.visible = false;
            }
            if(fish3 !== undefined){
                fish3.visible = false;
            }
            if(fish4 !== undefined){
                fish4.visible = false;
            }
            if(fish5 !== undefined){
                fish5.visible = false;
            }
            if(fish6 !== undefined){
                fish6.visible = false;
            }
            if(fish7 !== undefined){
                fish7.visible = false;
            }
            if(fish8 !== undefined){
                fish8.visible = false;
            }

        }else{

            border.visible = true;
            closeAquarium.visible = true;
            Aquainterface.visible = true;
            if(fish1 !== undefined){
                fish1.visible = true;
            }
            if(fish2 !== undefined){
                fish2.visible = true;
            }
            if(fish3 !== undefined){
                fish3.visible = true;
            }
            if(fish4 !== undefined){
                fish4.visible = true;
            }
            if(fish5 !== undefined){
                fish5.visible = true;
            }
            if(fish6 !== undefined){
                fish6.visible = true;
            }
            if(fish7 !== undefined){
                fish7.visible = true;
            }
            if(fish8 !== undefined){
                fish8.visible = true;
            }

        }

    }

    clickHandler(closeAquarium){
        activeAquarium = false;
        this.createAquariumInterface();
    }

    fillInventory(){
        this.arrayLength = this.inventory.length;
        for (var i = 0; i < this.arrayLength; i++) {
            if(this.inventory[i] != undefined){
                console.log(this.inventory);
                this.addFishToInventory(this.inventory[i]); // call add sprite method here
            }
        }
    }

    //reloads inventory from database
    addFishToInventory(dbFish){
        console.log("database: " + this.inventory['0']);
        console.log("database fish: " + dbFish);
        if(this.inventory['0'] === dbFish){
            fish1 = this.physics.add.sprite(140, 35, 'fish', dbFish);

            fish1.setVelocity(Phaser.Math.Between(5, 60), Phaser.Math.Between(5, 60));
            fish1.setBounce(1, 1);
            fish1.setCollideWorldBounds(true);
            fish1.fixedToCamera = true;
            fish1.setScrollFactor(0)
            fish1.body.setBoundsRectangle(new Phaser.Geom.Rectangle(60, 30, 200, 100));
            fish1.visible = false;

        }else if(this.inventory['1'] === dbFish){
            fish2 = this.physics.add.sprite(120, 35, 'fish', dbFish);

            fish2.setVelocity(Phaser.Math.Between(5, 60), Phaser.Math.Between(5, 60));
            fish2.setBounce(1, 1);
            fish2.setCollideWorldBounds(true);
            fish2.fixedToCamera = true;
            fish2.setScrollFactor(0)
            fish2.body.setBoundsRectangle(new Phaser.Geom.Rectangle(60, 30, 200, 100));
            fish2.visible = false;

        }else if(this.inventory['2'] === dbFish){
            fish3 = this.physics.add.sprite(160, 35, 'fish', dbFish);

            fish3.setVelocity(Phaser.Math.Between(5, 60), Phaser.Math.Between(5, 60));
            fish3.setBounce(1, 1);
            fish3.setCollideWorldBounds(true);
            fish3.fixedToCamera = true;
            fish3.setScrollFactor(0)
            fish3.body.setBoundsRectangle(new Phaser.Geom.Rectangle(60, 30, 200, 100));
            fish3.visible = false;

        }else if(this.inventory['3'] === dbFish){
            fish4 = this.physics.add.sprite(140, 55, 'fish', dbFish);

            fish4.setVelocity(Phaser.Math.Between(5, 60), Phaser.Math.Between(5, 60));
            fish4.setBounce(1, 1);
            fish4.setCollideWorldBounds(true);
            fish4.fixedToCamera = true;
            fish4.setScrollFactor(0)
            fish4.body.setBoundsRectangle(new Phaser.Geom.Rectangle(60, 30, 200, 100));
            fish4.visible = false;

        }else if(this.inventory['4'] === dbFish){
            fish5 = this.physics.add.sprite(160, 55, 'fish', dbFish);

            fish5.setVelocity(Phaser.Math.Between(5, 60), Phaser.Math.Between(5, 60));
            fish5.setBounce(1, 1);
            fish5.setCollideWorldBounds(true);
            fish5.fixedToCamera = true;
            fish5.setScrollFactor(0)
            fish5.body.setBoundsRectangle(new Phaser.Geom.Rectangle(60, 30, 200, 100));
            fish5.visible = false;

        }else if(this.inventory['5'] === dbFish){
            fish6 = this.physics.add.sprite(120, 55, 'fish', dbFish);

            fish6.setVelocity(Phaser.Math.Between(5, 60), Phaser.Math.Between(5, 60));
            fish6.setBounce(1, 1);
            fish6.setCollideWorldBounds(true);
            fish6.fixedToCamera = true;
            fish6.setScrollFactor(0)
            fish6.body.setBoundsRectangle(new Phaser.Geom.Rectangle(60, 30, 200, 100));
            fish6.visible = false;

        }else if(this.inventory['6'] === dbFish){
            fish7 = this.physics.add.sprite(180, 35, 'fish', dbFish);

            fish7.setVelocity(Phaser.Math.Between(5, 60), Phaser.Math.Between(5, 60));
            fish7.setBounce(1, 1);
            fish7.setCollideWorldBounds(true);
            fish7.fixedToCamera = true;
            fish7.setScrollFactor(0)
            fish7.body.setBoundsRectangle(new Phaser.Geom.Rectangle(60, 30, 200, 100));
            fish7.visible = false;

        }else if(this.inventory['7'] === dbFish){
            fish8 = this.physics.add.sprite(180, 55, 'fish', dbFish);

            fish8.setVelocity(Phaser.Math.Between(5, 60), Phaser.Math.Between(5, 60));
            fish8.setBounce(1, 1);
            fish8.setCollideWorldBounds(true);
            fish8.fixedToCamera = true;
            fish8.setScrollFactor(0)
            fish8.body.setBoundsRectangle(new Phaser.Geom.Rectangle(60, 30, 200, 100));
            fish8.visible = false;

        }

        console.log(inventory);
    }

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
