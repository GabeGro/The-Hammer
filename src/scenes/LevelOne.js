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

        //add players & enemies
        this.player1 = new Player(this, 75, 200, 'player', 0, 'right').setOrigin(1, 1).setScale(2).setSize(20, 20)
        this.thug1 = new Thug(this, 500, 200, 'thug', 0, 'right').setScale(2.1).setOrigin(1, 1).setSize(20, 20)
        this.hammer = new Hammer(this, 700, 200, 'hammer', 0, 'right').setScale(3).setOrigin(1, 1).setSize(20, 20)

        //add chairs
        this.chair1 = this.physics.add.sprite(200, 200, 'chair').setScale(3).setSize(10, 10)
        this.chair1.body.setImmovable(true)

        //add colliders
        this.physics.add.collider(this.player1, this.thug1, (player, thug) => {
            if (this.playerFSM.state == 'playerAttack' && this.thugFSM.state == 'thugStun') {
                this.thug1.playerHit = true
            }
            if (this.thugFSM.state == 'thugAttack') {
                this.player1.thugHit = true
                //console.log(`thughit: ${this.thugHit}`)
            }
        })
        this.physics.add.collider(this.player1, this.hammer, (player, hammer) => {
            if (this.playerFSM.state == 'playerAttack' && this.hammerFSM.state == 'hammerStun') {
                this.hammer.playerHit = true
            }
            if (this.hammerFSM.state == 'hammerAttack' || this.hammerFSM.state == 'hammerSpecial') {
                this.player1.hammerHit = true
                //console.log(`thughit: ${this.thugHit}`)
            }
        })
        this.physics.add.collider(this.player1, this.chair1, (player, chair) => {
            if (Phaser.Input.Keyboard.JustDown(this.keys.EKey)) {
                this.player1.playerChair = true
            }
        })
        this.physics.add.collider(this.thug1, this.chair1, (thug, chair) => {
            if (this.playerFSM.state == 'playerChair' && this.thugFSM.state == 'thugStun') {
                this.thug1.playerHit = true
            }
        })
        this.physics.add.collider(this.hammer, this.chair1, (hammer, chair) => {
            if (this.playerFSM.state == 'playerChair' && this.hammerFSM.state == 'hammerStun') {
                this.hammer.playerHit = true
            }
        })

        // set up camera
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height)
        this.cameras.main.startFollow(this.player1, false, 0.5, 0.5)
        this.physics.world.setBounds(0, 70, this.background.width, this.background.height-90)

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
        this.keys.EKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>CharacterFSM.js:</strong> Arrows: move | SPACE: attack | SHIFT: block | Return: next level | D: debug (toggle)'
    }

    update() {
        //update fsm's
        if (this.player1 && this.player1.active) {
            this.playerFSM.step() 
            this.player1.update(this)
        }
        if (this.thug1 && this.thug1.active) {
            this.thugFSM.step() 
        }
        if (this.hammer && this.hammer.active) {
            this.hammerFSM.step() 
        }

        //update health
        if (this.thug1 && this.thug1.health <= 0) {
            this.thug1.destroy()
            this.thug1 = null
        }
        if (this.hammer && this.hammer.health <= 0) {
            this.hammer.destroy()
            this.hammer = null
        }

        //temp scene change
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.start('levelTwoScene')
        }
    }
}