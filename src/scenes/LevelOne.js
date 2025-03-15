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
        this.player1 = new Player(this, 75, 200, 'player', 0, 'right').setOrigin(1, 1).setScale(2).setSize(20, 20)
        this.thug1 = new Enemy(this, 500, 200, 'thug', 0, 'right', this.player1).setScale(2.1).setOrigin(1, 1).setSize(20, 20)

        //damage flags
        this.thugHit = false
        this.playerHit = false

        //add colliders
        this.physics.add.collider(this.player1, this.thug1, (player, thug) => {
            if (this.playerFSM.state == 'playerAttack') {
                this.playerHit = true
            }
            if (this.enemyFSM.state == 'attack') {
                this.thugHit = true
                //console.log(`thughit: ${this.thugHit}`)
            }
        })

        // set up camera
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height)
        this.cameras.main.startFollow(this.player1, false, 0.5, 0.5)
        this.physics.world.setBounds(0, 70, this.background.width, this.background.height-90)

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
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
        //update fsm's
        this.playerFSM.step()
        this.enemyFSM.step()

        //update health
        /*if (this.playerHit) {
            this.thug1.update()
            this.playerHit = false
        }
        if (this.thugHit) {
            this.player1.update()
        }*/

        //temp scene change
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.start('levelTwoScene')
        }
    }
}