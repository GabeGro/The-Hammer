class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        //load images
        this.load.path = './assets/'
        this.load.image('levelOneBG', 'TempBG.png')
        this.load.image('levelTwoBG', 'leveltwo-BG.png')
        this.load.image('chair', 'chair.png')
        this.load.image('play-button', 'play-button.png')
        this.load.image('resume-button', 'resume-button.png')
        this.load.image('menu-button', 'menu-button.png')

        //load fonts
        this.load.bitmapFont('jersey', 'Jersey/Jersey.png', 'Jersey/Jersey.xml')
        
        //load sprite sheets
        this.load.spritesheet('player', 'player-sheetTemp.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('thug', 'thug-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('hammer', 'hammer-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })

        //load sfx and music
        this.load.audio('player-punch', 'player-punch.mp3')
        this.load.audio('player-walking', 'player-walking.wav')
    }

    create() {
        //load animations
        this.animationCreation()

        this.add.image(0, 0, 'levelOneBG').setOrigin(0)
        this.add.bitmapText(200, 75, 'jersey', 'THE', 60).setOrigin(0.5, 0.5)
        this.add.bitmapText(200, 130, 'jersey', 'HAMMER', 90).setOrigin(0.5, 0.5)
        this.add.sprite

        //buttons
        let playButton = this.add.image(200, 220, 'play-button').setOrigin(0.5, 0.5).setScale(0.2).setInteractive().on('pointerdown', () => {
            //this.sound.play('select')
            this.scene.start('levelOneScene')
        }).on('pointerover', () => playButton.setTint(0xaaaaaa)).on('pointerout', () => playButton.clearTint())

        
    }

    animationCreation() {
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
            frames: this.anims.generateFrameNumbers('thug', { start: 1, end: 4 }),
        })
        this.anims.create({
            key: 'thugWalk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('thug', { start: 5, end: 8 }),
        })
        this.anims.create({
            key: 'hammerWalk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 1, end: 4 }),
        })
        this.anims.create({
            key: 'hammerWalk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 5, end: 8 }),
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
        this.anims.create({
            key: 'hammerBlock-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 14, end: 14 }),
        })
        this.anims.create({
            key: 'hammerBlock-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 13, end: 13 }),
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
            frames: this.anims.generateFrameNumbers('thug', { start: 9, end: 10 }),
        })
        this.anims.create({
            key: 'thugAttack-left',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('thug', { start: 11, end: 12 }),
        })
        this.anims.create({
            key: 'hammerAttack-right',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 9, end: 10 }),
        })
        this.anims.create({
            key: 'hammerAttack-left',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 11, end: 12 }),
        })
        this.anims.create({
            key: 'hammerSpecial-right',
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 9, end: 10 }),
        })
        this.anims.create({
            key: 'hammerSpecial-left',
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 11, end: 12 }),
        })
    }
}