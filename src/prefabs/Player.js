class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction) {
        super (scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)
        this.body.setImmovable(true)

        this.direction = direction 
        this.playerVelocity = 200    // in pixels
        this.hurtTimer = 5000       // in ms
        this.health = 100

        //damage & chair flags
        this.playerChair = false
        this.thugHit = false
        this.hammerHit = false

        // initialize state machine managing player
        scene.playerFSM = new StateMachine('playerIdle', {
            playerIdle: new PlayerIdleState(),
            playerMove: new PlayerMoveState(),
            playerAttack: new PlayerAttackState(),
            playerBlock: new PlayerBlockState(),
            playerHurt: new PlayerHurtState(),
            playerChair: new PlayerChairState(),
        }, [scene, this])
    }

    update(scene) {
        if(this.playerChair) {
            scene.chairGrab.x = this.x - 32.5
            scene.chairGrab.y = this.y - 65
        }
    }
}

class PlayerIdleState extends State {
    enter (scene, player) {
        console.log('playerIdle')
        player.setVelocity(0)
        player.anims.play(`playerWalk-${player.direction}`)
        player.anims.stop()
        player.setSize(20, 20)
    }

    execute(scene, player) {
        //local copy of the keyboard
        const { left, right, up, down, space, shift } = scene.keys
        const EKey = scene.keys.EKey

        if(space.isDown && player.playerChair) {
            this.stateMachine.transition('playerChair')
            return
        }
        
        if(space.isDown) {
            this.stateMachine.transition('playerAttack')
            return
        }

        if(shift.isDown && !player.playerChair) {
            this.stateMachine.transition('playerBlock')
            return
        }

        if(player.thugHit || player.hammerHit) {
            console.log(`thug: ${player.thugHit}`)
            console.log(`hammer: ${player.hammerHit}`)
            this.stateMachine.transition('playerHurt')
            return
        }

        // transition to move if pressing a movement key
        if(left.isDown || right.isDown || up.isDown || down.isDown ) {
            this.stateMachine.transition('playerMove')
            return
        }
    }
}

class PlayerMoveState extends State {
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const EKey = scene.keys.EKey

        if(space.isDown && player.playerChair) {
            this.stateMachine.transition('playerChair')
            return
        }
        
        // transition to attack if pressing space
        if(space.isDown) {
            this.stateMachine.transition('playerAttack')
            return
        }

        // transition to block if pressing shift
        if(shift.isDown && !player.playerChair) {
            this.stateMachine.transition('playerBlock')
            return
        }

        if(player.thugHit || player.hammerHit) {
            this.stateMachine.transition('playerHurt')
            return
        }

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('playerIdle')
            return
        }

        // handle movement
        let moveDirection = new Phaser.Math.Vector2(0, 0)
        if(up.isDown) {
            moveDirection.y = -1
        } else if(down.isDown) {
            moveDirection.y = 1
        }
        if(left.isDown) {
            moveDirection.x = -1
            player.direction = 'left'
        } else if(right.isDown) {
            moveDirection.x = 1
            player.direction = 'right'
        }
        // normalize movement vector, update player position, and play proper animation
        moveDirection.normalize()
        player.setVelocity(player.playerVelocity * moveDirection.x, player.playerVelocity * moveDirection.y)
        player.anims.play(`playerWalk-${player.direction}`, true)
        if (!scene.playerWalking.isPlaying) {
            scene.playerWalking.stop()
            scene.playerWalking.play()
        }
    }
}

class PlayerAttackState extends State {
    execute(scene, player) {
        const { left, right, up, down, space, shift } = scene.keys

        player.setVelocity(0)
        player.anims.play(`playerAttack-${player.direction}`, true)
        player.setSize(35, 20)
            
            //play sfx
        if (!scene.playerPunch.isPlaying) {
            scene.playerPunch.stop()
            scene.playerPunch.play()
        }

        if(player.thugHit || player.hammerHit) {
            this.stateMachine.transition('playerHurt')
            return
        } else if(!(space.isDown)) { 
            this.stateMachine.transition('playerIdle')
            return
        }
    }
}

class PlayerBlockState extends State {
    execute(scene, player) {
        const { left, right, up, down, space, shift } = scene.keys

        if(player.hammerHit && scene.hammerFSM.state == 'hammerSpecial') {
            player.hammerHit = false
            this.stateMachine.transition('playerHurt')
            return
        }

        player.setVelocity(0)
        player.anims.play(`playerBlock-${player.direction}`, true)

        if (!(shift.isDown)) {
            player.clearTint()
            player.thugHit = false
            player.hammerHit = false
            this.stateMachine.transition('playerIdle')
            return
        }
    }
}

class PlayerHurtState extends State {
    enter(scene, player) {
        console.log(`playerHurt`)
        player.setVelocity(0)
        player.anims.play(`playerWalk-${player.direction}`)
        player.anims.stop()
        player.setTint(0xFF0000)
        if (player.thugHit) {
            player.health -= 50
        } else if (player.hammerHit) {
            player.health -= 25
        }

        switch(player.direction) {
            case 'left':
                player.setVelocityX(player.playerVelocity)
                break
            case 'right':
                player.setVelocityX(-player.playerVelocity)
                break
        }

        // set recovery timer
        scene.time.delayedCall(250, () => {
            if (player.health > 0) {
                player.clearTint()
                player.thugHit = false
                player.hammerHit = false
                console.log(`${player.thugHit}`)
                this.stateMachine.transition('playerIdle')
                return
            }
        })
    }
}

class PlayerChairState extends State {
    enter(scene, player) {
        console.log('chair')

        player.setVelocity(0)
        player.playerChair = false
        switch(player.direction) {
            case 'left':
                scene.chairGrab.x -= 30
                scene.chairGrab.y += 30
                break
            case 'right':
                scene.chairGrab.x += 30
                scene.chairGrab.y += 30
                break
        }

        scene.time.delayedCall(200, () => {
            scene.chairGrab.destroy()
            this.stateMachine.transition('playerIdle')
            return
        })
    }
}
