class Hammer extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction) {
        super (scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)
        this.body.setImmovable(true)

        this.direction = direction 
        this.hammerVelocity = 75    // in pixels
        this.health = 100
        this.specialAttack = false
        this.playerHit = false

        // initialize state machine managing hammer (initial state, possible states, state args[])
        scene.hammerFSM = new StateMachine('hammerIdle', {
            hammerIdle: new hammerIdleState(),
            hammerMove: new hammerMoveState(),
            hammerAttack: new hammerAttackState(),
            hammerHurt: new hammerHurtState(),
            hammerStun: new hammerStunState(),
            hammerSpecial: new hammerSpecialState(),
        }, [scene, this])
    }
}

class hammerIdleState extends State {
    enter(scene, hammer) {
        console.log('hammerIdle')
        hammer.setVelocity(0)
        hammer.anims.play(`hammerWalk-${hammer.direction}`)
        hammer.anims.stop()
        hammer.setSize(20, 20)
        hammer.playerHit = false
    }

    execute(scene, hammer) {
        const player = scene.player1

        if (Phaser.Math.Distance.Between(hammer.x, hammer.y, player.x, player.y) < 200) {
            this.stateMachine.transition('hammerMove')
            return
        }
    }
}

class hammerMoveState extends State {
    enter(scene, hammer) {
        console.log('hammerMove')
    }
    
    execute(scene, hammer) {
        const player = scene.player1
        const direction = new Phaser.Math.Vector2(player.x - hammer.x, player.y - hammer.y).normalize()

        if (direction.x < 0) {
            hammer.direction = 'left'
        } else {
            hammer.direction = 'right'
        }
        
        hammer.setVelocity(direction.x * hammer.hammerVelocity, direction.y * hammer.hammerVelocity)
        hammer.anims.play(`hammerWalk-${hammer.direction}`, true)

        if (Phaser.Math.Distance.Between(hammer.x, hammer.y, player.x, player.y) < 70 && !hammer.specialAttack) {
            this.stateMachine.transition('hammerAttack')
        }

        if (Phaser.Math.Distance.Between(hammer.x, hammer.y, player.x, player.y) < 70 && hammer.specialAttack) {
            this.stateMachine.transition('hammerSpecial')
        }
    }
}

class hammerAttackState extends State {
    enter(scene, hammer) {
        console.log('hammerAttack')
        hammer.setVelocity(0)
        hammer.anims.play(`hammerAttack-${hammer.direction}`)
        hammer.setSize(35, 20)
        scene.thugAttack.play()

        scene.time.delayedCall(2000, () => {
            hammer.specialAttack = true
            scene.thugAttack.stop()
            this.stateMachine.transition('hammerStun')
            return
        })
    }
}

class hammerSpecialState extends State {
    enter(scene, hammer) {
        console.log('hammerSpecial')
        hammer.setVelocity(0)
        hammer.setTint(0x0000FF)
        hammer.anims.play(`hammerSpecial-${hammer.direction}`)

        hammer.on('animationupdate', (anim, frame) => {
            if (anim.key === `hammerSpecial-${hammer.direction}` && frame.index == 2) {
                hammer.setSize(35,20)
                scene.hammerSpecial.play()
            }
        })

        scene.time.delayedCall(1000, () => {
            hammer.specialAttack = false
            hammer.clearTint()
            this.stateMachine.transition('hammerStun')
            return
        })
    }
}

class hammerHurtState extends State {
    enter(scene, hammer) {
        hammer.setVelocity(0)
        hammer.anims.play(`hammerWalk-${hammer.direction}`)
        hammer.anims.stop()

        // set recovery timer
        scene.time.delayedCall(1000, () => {
            if(hammer.health > 0) {
                hammer.clearTint()
                this.stateMachine.transition('hammerIdle')
                return
            }
        })
    }

    execute(scene, hammer) {
        if(hammer.playerHit) {
            hammer.setTint(0xFF0000)
            if (!scene.hammerHurt.isPlaying) {
                scene.hammerHurt.stop()
                scene.hammerHurt.play()
            }
            scene.time.delayedCall(500, () => {
                if(hammer.health > 0) {
                    hammer.health -= 10
                    console.log(`health: ${hammer.health}`)
                    hammer.clearTint()
                    hammer.setVelocity(0)
                    hammer.playerHit = false
                }
            })
        }
    }
}

class hammerStunState extends State {
    enter(scene, hammer) {
        console.log('hammerStun')
        hammer.anims.play(`hammerWalk-${hammer.direction}`)
        hammer.anims.stop()
        hammer.setSize(20, 20)

        scene.time.delayedCall(2000, () => {
            if (this.stateMachine.state == 'hammerStun') {
                this.stateMachine.transition('hammerIdle')
                return
            }
        })
    }
    execute(scene, hammer) {
        if (hammer.playerHit) {
            this.stateMachine.transition('hammerHurt')
            return
        }
    }
}
