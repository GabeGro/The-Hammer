class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        //load images
        this.load.path = './assets/'
        this.load.image('levelOneBG', 'levelOne-BG.png')
        this.load.image('levelTwoBG', 'leveltwo-BG.png')
        this.load.image('chair', 'chair.png')
        this.load.image('play-button', 'play-button.png')
        this.load.image('resume-button', 'resume-button.png')
        this.load.image('menu-button', 'menu-button.png')

        //load fonts
        this.load.bitmapFont('jersey', 'Jersey/Jersey.png', 'Jersey/Jersey.xml')
        
        //load sprite sheets
        this.load.spritesheet('player', 'player-sheet.png', {
            frameWidth: 32,
            frameHeight: 34,
        })
        this.load.spritesheet('thug', 'thug-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('hammer', 'hammer-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('healthbar', 'healthbar.png', {
            frameWidth: 160,
            frameHeight: 32,
        })

        //load sfx and music
        this.load.audio('player-punch', 'player-punch.wav')
        this.load.audio('player-walking', 'player-walking.wav')
        this.load.audio('player-hurt', 'player-hurt.wav')

        this.load.audio('thug-attack', 'thug-attack.wav')
        this.load.audio('thug-walking', 'thug-walking.wav')
        this.load.audio('thug-hurt', 'thug-hurt.wav')

        this.load.audio('hammer-attack', 'hammer-attack.wav')
        this.load.audio('hammer-walking', 'hammer-walking.wav')
        this.load.audio('hammer-hurt', 'hammer-hurt.wav')
        this.load.audio('hammer-special', 'hammer-special.wav')

        this.load.audio('gameover', 'gameover.wav')
        this.load.audio('bgMusic', 'bgMusic.mp3')
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
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('thug', { start: 9, end: 10 }),
        })
        this.anims.create({
            key: 'thugAttack-left',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('thug', { start: 11, end: 12 }),
        })
        this.anims.create({
            key: 'hammerAttack-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 9, end: 10 }),
        })
        this.anims.create({
            key: 'hammerAttack-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hammer', { start: 11, end: 12 }),
        })

        //special attacks
        this.anims.create({
            key: 'hammerSpecial-right',
            frameRate: 2,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hammer', { start: 15, end: 16 }),
        })
        this.anims.create({
            key: 'hammerSpecial-left',
            frameRate: 2,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hammer', { start: 17, end: 18 }),
        })
        this.anims.create({
            key: 'playerChair-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 18 }),
        })
        this.anims.create({
            key: 'playerChair-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 19, end: 22 }),
        })

        //healthbar animations
        this.anims.create({
            key: 'healthbarUpdate',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('healthbar', { start: 0, end: 10 }),
        })

        this.scene.start('menuScene')
    }
}