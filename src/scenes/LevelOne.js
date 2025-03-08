class LevelOne extends Phaser.Scene {
    constructor() {
        super("levelOneScene")
    }

    create() {
        // add background image
        this.background = this.add.image(0, 0, 'levelOneBG').setOrigin(0)

        //add sfx and music
        this.playerPunch = this.sound.add('player-punch')
        this.playerWalking = this.sound.add('player-walking')

        //add players
        this.thug1 = new Enemy(this, 500, 200, 'thug', 0, 'right').setScale(2.1).setOrigin(1, 1).setSize(30, 20)
        this.player1 = new Player(this, 75, 200, 'player', 0, 'right').setOrigin(1, 1).setScale(2) 

        // set up camera
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height)
        this.cameras.main.startFollow(this.player1, false, 0.5, 0.5)
        this.physics.world.setBounds(0, 70, this.background.width, this.background.height-90)

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>CharacterFSM.js:</strong> Arrows: move | SPACE: attack | SHIFT: block | H: hurt (knockback) | Return: next level | D: debug (toggle)'
    }

    update() {
        // make sure we step (ie update) the hero's state machine
        this.playerFSM.step()

        //temp scene change
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.start('levelTwoScene')
        }
    }
}