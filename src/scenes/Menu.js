class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    create() {
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
}