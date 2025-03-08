class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        //load images
        this.load.path = './assets/'
        this.load.image('levelOneBG', 'TempBG.png')
        this.load.image('levelTwoBG', 'leveltwo-BG.png')
        
        //load sprite sheets
        this.load.spritesheet('player', 'player-sheetTemp.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('thug', 'thug-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })

        //load sfx and music
        this.load.audio('player-punch', 'player-punch.mp3')
        this.load.audio('player-walking', 'player-walking.wav')
    }

    create() {
        // walking animations
        this.anims.create({
            key: 'playerWalk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 4 }),
        })
        this.anims.create({
            key: 'playerWalk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        })
        this.anims.create({
            key: 'thugWalk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 4 }),
        })
        this.anims.create({
            key: 'thugWalk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        })

        //block animation
        this.anims.create({
            key: 'playerBlock-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 14, end: 14 }),
        })
        this.anims.create({
            key: 'playerBlock-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 13, end: 13 }),
        })

        //attack animations
        this.anims.create({
            key: 'playerAttack-right',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 10 }),
        })
        this.anims.create({
            key: 'playerAttack-left',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 11, end: 12 }),
        })
        this.anims.create({
            key: 'thugAttack-right',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 10 }),
        })
        this.anims.create({
            key: 'thugAttack-left',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 11, end: 12 }),
        })

        // proceed once loading completes
        this.scene.start('levelOneScene')
    }
}