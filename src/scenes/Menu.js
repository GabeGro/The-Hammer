class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        //load images
        this.load.path = './assets/'
        this.load.image('background', 'TempBG.png')
        this.load.spritesheet('player', 'player-sheetTemp.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
    }

    create() {
        //idle animation
        this.anims.create({
            key: 'idle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 4 }),
        })
        
        // walking animations
        this.anims.create({
            key: 'walk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 4 }),
        })
        this.anims.create({
            key: 'walk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        })

        //block animation
        this.anims.create({
            key: 'block-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 14, end: 14 }),
        })
        this.anims.create({
            key: 'block-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 13, end: 13 }),
        })

        //attack animations
        this.anims.create({
            key: 'attack-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 10 }),
        })
        this.anims.create({
            key: 'attack-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 11, end: 12 }),
        })

        // proceed once loading completes
        this.scene.start('playScene')
    }
}