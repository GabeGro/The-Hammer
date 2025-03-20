class LevelOne extends Phaser.Scene {
    constructor() {
        super("levelOneScene")
    }

    create() {
        // add background image
        this.background = this.add.image(0, 0, 'levelOneBG').setOrigin(0)

        this.pause = false
        this.winCondition = 3

        //add sfx and music
        this.playerPunch = this.sound.add('player-punch')
        this.playerWalking = this.sound.add('player-walking')
        this.playerHurt = this.sound.add('player-hurt')

        this.thugAttack = this.sound.add('thug-attack', {
            loop: true,
        })
        this.thugWalking = this.sound.add('thug-walking')
        this.thugHurt = this.sound.add('thug-hurt')

        this.hammerAttack = this.sound.add('hammer-attack', {
            loop: true,
            rate: 0.5,
        })
        this.hammerSpecial = this.sound.add('hammer-special')
        this.hammerWalking = this.sound.add('hammer-walking')
        this.hammerHurt = this.sound.add('hammer-hurt')

        this.gameOverFX = this.sound.add('gameover')
        this.BGMusic = this.sound.add('bgMusic', {
            loop: true,
            volume: 0.2,
        })
        this.BGMusic.play()

        //add players & enemies
        this.player1 = new Player(this, 75, 200, 'player', 0, 'right').setOrigin(0.5).setScale(2).setSize(20, 20)

        this.thug1 = new Thug(this, 450, 200, 'thug', 0, 'left').setScale(2.1).setOrigin(0.5).setSize(20, 20)
        this.thug2 = new Thug(this, 675, 180, 'thug', 0, 'left').setScale(2.1).setOrigin(0.5).setSize(20, 20)
        this.thug3 = new Thug(this, 700, 250, 'thug', 0, 'left').setScale(2.1).setOrigin(0.5).setSize(20, 20)

        this.thugs = this.add.group([this.thug1, this.thug2, this.thug3])

        //add colliders
        this.physics.add.collider(this.player1, this.thugs, (player, thug) => {
            if (this.playerFSM.state == 'playerAttack' && thug.thugFSM.state == 'thugStun') {
                thug.playerHit = true
            }
            if (thug.thugFSM.state == 'thugAttack') {
                this.player1.thugHit = true
                //console.log(`thughit: ${this.thugHit}`)
            }
        })

        // set up camera
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height)
        this.cameras.main.startFollow(this.player1, false, 0.5, 0.5)
        this.physics.world.setBounds(0, 70, this.background.width - 30, this.background.height - 90)

        //add healthbar
        this.healthbar = this.add.sprite(this.cameras.main.scrollX + 10, this.cameras.main.scrollY + 7, 'healthbar', 0).setOrigin(0).setScale(0.9)

        //add tutorial text
        this.tutorialText1 = this.add.bitmapText(this.cameras.main.scrollX + 200, this.cameras.main.scrollY + 75, 'jersey', 'Use arrows to move', 40).setOrigin(0.5, 0.5)

        this.time.delayedCall(2000, () => {
            this.tutorialText1.destroy()
            this.tutorialText2 = this.add.bitmapText(this.cameras.main.scrollX + 200, this.cameras.main.scrollY + 75, 'jersey', 'Press space to attack', 40).setOrigin(0.5, 0.5)
            this.tutorialText3 = this.add.bitmapText(this.cameras.main.scrollX + 200, this.cameras.main.scrollY + 110, 'jersey', 'and shift to block', 40).setOrigin(0.5, 0.5)
            this.time.delayedCall(2000, () => {
                this.tutorialText2.destroy()
                this.tutorialText3.destroy()
            })
        })

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
        this.keys.EKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        this.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>CharacterFSM.js:</strong> Arrows: move | SPACE: attack | SHIFT: block | Return: next level | D: debug (toggle)'
    }

    update() {
        if (!this.pause) {
            //update fsm's
            if (this.player1 && this.player1.active) {
                this.playerFSM.step()
                this.player1.update(this)
            }
            if (this.thugs && this.thugs.active && this.player1) {
                this.thugs.getChildren().forEach(thug => {
                    thug.update()
                })
            }

            //update health
            if (this.thugs && this.thugs.active) {
                this.thugs.getChildren().forEach(thug => {
                    if (thug && thug.health <= 0) {
                        thug.destroy()
                        thug = null
                        this.winCondition -= 1
                    }
                })
            }

            //update healthbar
            //console.log(`${this.player1.health}`)
            if (this.player1.health <= 0) {
                this.healthbar.setFrame(10)
            } else if (this.player1.health <= 10) {
                this.healthbar.setFrame(9)
            } else if (this.player1.health <= 20) {
                this.healthbar.setFrame(8)
            } else if (this.player1.health <= 30) {
                this.healthbar.setFrame(7)
            } else if (this.player1.health <= 40) {
                this.healthbar.setFrame(6)
            } else if (this.player1.health <= 50) {
                this.healthbar.setFrame(5)
            } else if (this.player1.health <= 60) {
                this.healthbar.setFrame(4)
            } else if (this.player1.health <= 70) {
                this.healthbar.setFrame(3)
            } else if (this.player1.health <= 80) {
                this.healthbar.setFrame(2)
            } else if (this.player1.health <= 90) {
                this.healthbar.setFrame(1)
            }
            this.healthbar.x = this.cameras.main.scrollX + 10
            this.healthbar.y = this.cameras.main.scrollY + 7

            if (this.player1 && this.player1.health <= 0) {
                this.player1.destroy()
                this.player1 = null
                this.gameOverScreen()
            }

            //update tutorial

            //level progression
            if (this.winCondition <= 0 && this.player1.x > this.background.width - 60) {
                this.BGMusic.stop()
                this.scene.start('levelTwoScene')
            }

            //temp scene change
            if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                this.BGMusic.stop()
                this.scene.start('levelTwoScene')
            }
        }

        //pause scene
        if (Phaser.Input.Keyboard.JustDown(this.ESCKey)) {
            if (this.pause) {
                this.resumeScene()
            } else {
                this.pauseScene()
            }
        }
    }

    pauseScene() {
        this.physics.pause()
        this.pause = true

        this.overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.3)
        this.pauseText = this.add.bitmapText(this.cameras.main.scrollX + 200, this.cameras.main.scrollY + 100, 'jersey', 'PAUSE', 90).setOrigin(0.5, 0.5)
        /*this.resumeButton = this.add.image(350, 300, 'resume-button').setOrigin(0.5, 0.5).setScale(0.2).setInteractive().on('pointerdown', () => {
            //this.sound.play('select')
            this.input.keyboard.emit(this.ESCKey)
        }).on('pointerover', () => this.resumeButton.setTint(0xaaaaaa)).on('pointerout', () => this.resumeButton.clearTint())*/
        this.menuButton = this.add.image(this.cameras.main.scrollX + 200, this.cameras.main.scrollY + 220, 'menu-button').setOrigin(0.5, 0.5).setScale(0.2).setInteractive().on('pointerdown', () => {
            //this.sound.play('select')
            this.scene.start('menuScene')
            this.BGMusic.stop()
        }).on('pointerover', () => this.menuButton.setTint(0xaaaaaa)).on('pointerout', () => this.menuButton.clearTint())
    }

    resumeScene() {
        this.physics.resume()
        this.pause = false

        this.overlay.destroy()
        this.menuButton.destroy()
        this.pauseText.destroy()
        //this.resumeButton.destroy()
    }

    gameOverScreen() {
        this.BGMusic.stop()
        this.gameOverFX.play()
        this.physics.pause()
        this.pause = true

        this.overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.3)
        this.pauseText = this.add.bitmapText(this.cameras.main.scrollX + 200, this.cameras.main.scrollY + 100, 'jersey', 'GAME OVER', 90).setOrigin(0.5, 0.5)
        this.menuButton = this.add.image(this.cameras.main.scrollX + 200, this.cameras.main.scrollY + 220, 'menu-button').setOrigin(0.5, 0.5).setScale(0.2).setInteractive().on('pointerdown', () => {
            //this.sound.play('select')
            this.scene.start('menuScene')
        }).on('pointerover', () => this.menuButton.setTint(0xaaaaaa)).on('pointerout', () => this.menuButton.clearTint())
    }
}