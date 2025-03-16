class Thug extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction) {
        super (scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)
        this.body.setImmovable(true)

        this.direction = direction 
        this.thugVelocity = 75    // in pixels
        this.health = 100

        // initialize state machine managing thug (initial state, possible states, state args[])
        scene.thugFSM = new StateMachine('thugIdle', {
            thugIdle: new thugIdleState(),
            thugMove: new thugMoveState(),
            thugAttack: new thugAttackState(),
            thugHurt: new thugHurtState(),
            thugStun: new ThugStunState(),
        }, [scene, this])
    }
}

class thugIdleState extends State {
    enter(scene, thug) {
        console.log('thugIdle')
        thug.setVelocity(0)
        thug.anims.play(`thugWalk-${thug.direction}`)
        thug.anims.stop()
        thug.setSize(20, 20)
        scene.playerHit = false
    }

    execute(scene, thug) {
        const player = scene.player1

        if (Phaser.Math.Distance.Between(thug.x, thug.y, player.x, player.y) < 200) {
            this.stateMachine.transition('thugMove')
            return
        }
    }
}

class thugMoveState extends State {
    enter(scene, thug) {
        console.log('thugMove')
    }
    
    execute(scene, thug) {
        const player = scene.player1
        const direction = new Phaser.Math.Vector2(player.x - thug.x, player.y - thug.y).normalize()

        if (direction.x < 0) {
            thug.direction = 'left'
        } else {
            thug.direction = 'right'
        }
        
        thug.setVelocity(direction.x * thug.thugVelocity, direction.y * thug.thugVelocity)
        thug.anims.play(`thugWalk-${thug.direction}`, true)

        if (Phaser.Math.Distance.Between(thug.x, thug.y, player.x, player.y) < 59) {
            this.stateMachine.transition('thugAttack')
        }
    }
}

class thugAttackState extends State {
    enter(scene, thug) {
        console.log('thugAttack')
        thug.setVelocity(0)
        thug.anims.play(`thugAttack-${thug.direction}`)
        thug.setSize(35, 20)

        scene.time.delayedCall(2000, () => {
            this.stateMachine.transition('thugStun')
            return
        })
    }
}

class thugHurtState extends State {
    enter(scene, thug) {
        thug.setVelocity(0)
        thug.anims.play(`thugWalk-${thug.direction}`)
        thug.anims.stop()

        // set recovery timer
        scene.time.delayedCall(1000, () => {
            if(thug.health > 0) {
                thug.clearTint()
                this.stateMachine.transition('thugIdle')
                return
            }
        })
    }

    execute(scene, thug) {
        if(scene.playerHit) {
            thug.setTint(0xFF0000)
            scene.time.delayedCall(500, () => {
                if(thug.health > 0) {
                    thug.health -= 10
                    console.log(`health: ${thug.health}`)
                    thug.clearTint()
                    thug.setVelocity(0)
                    scene.playerHit = false
                }
            })
        }
    }
}

class ThugStunState extends State {
    enter(scene, thug) {
        console.log('stun')
        thug.anims.play(`thugWalk-${thug.direction}`)
        thug.anims.stop()
        thug.setSize(20, 20)

        scene.time.delayedCall(2000, () => {
            if (this.stateMachine.state == 'thugStun') {
                this.stateMachine.transition('thugIdle')
                return
            }
        })
    }
    execute(scene, thug) {
        if (scene.playerHit) {
            this.stateMachine.transition('thugHurt')
            return
        }
    }
}
