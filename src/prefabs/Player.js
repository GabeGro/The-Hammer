class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction) {
        super (scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)

        this.direction = direction 
        this.playerVelocity = 200    // in pixels
        this.hurtTimer = 250       // in ms

        // initialize state machine managing player
        scene.playerFSM = new StateMachine('playerIdle', {
            playerIdle: new PlayerIdleState(),
            playerMove: new PlayerMoveState(),
            playerAttack: new PlayerAttackState(),
            playerBlock: new PlayerBlockState(),
            playerHurt: new PlayerHurtState(),
        }, [scene, this])
    }
}

class PlayerIdleState extends State {
    enter (scene, player) {
        player.setVelocity(0)
        player.anims.play(`playerWalk-${player.direction}`)
        player.anims.stop()
    }

    execute(scene, player) {
        //local copy of the keyboard
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey

        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('playerAttack')
            return
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('playerBlock')
            return
        }

        // hurt if H key input (temp)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
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
        const HKey = scene.keys.HKey

        // transition to attack if pressing space
        if(space.isDown) {
            this.stateMachine.transition('playerAttack')
            return
        }

        // transition to block if pressing shift
        if(shift.isDown) {
            this.stateMachine.transition('playerBlock')
            return
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
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
        
        //play sfx
        if (!scene.playerPunch.isPlaying) {
            scene.playerPunch.stop()
            scene.playerPunch.play()
        }

        if(!(space.isDown)) { 
            this.stateMachine.transition('playerIdle')
            return
        }
    }
}

class PlayerBlockState extends State {
    execute(scene, player) {
        const { left, right, up, down, space, shift } = scene.keys

        player.setVelocity(0)
        player.anims.play(`playerBlock-${player.direction}`, true)

        // set a short cooldown delay before going back to idle
        if (!(shift.isDown)) {
            player.clearTint()
            this.stateMachine.transition('playerIdle')
            return
        }
    }
}

class PlayerHurtState extends State {
    enter(scene, player) {
        player.setVelocity(0)
        player.anims.play(`playerWalk-${player.direction}`)
        player.anims.stop()
        player.setTint(0xFF0000)     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(player.direction) {
            case 'left':
                player.setVelocityX(player.playerVelocity)
                break
            case 'right':
                player.setVelocityX(-player.playerVelocity)
                break
        }

        // set recovery timer
        scene.time.delayedCall(player.hurtTimer, () => {
            player.clearTint()
            this.stateMachine.transition('playerIdle')
        })
    }
}
