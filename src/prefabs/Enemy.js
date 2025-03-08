class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction) {
        super (scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)

        this.direction = direction 
        this.thugVelocity = 200    // in pixels
        this.hurtTimer = 250       // in ms

        // initialize state machine managing thug (initial state, possible states, state args[])
        scene.thugFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            attack: new AttackState(),
            hurt: new HurtState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

class IdleState extends State {
    enter (scene, thug) {
        thug.setVelocity(0)
        thug.anims.play(`walk-${thug.direction}`)
        thug.anims.stop()
    }

    execute(scene, thug) {
        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('attack')
            return
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('block')
            return
        }

        // hurt if H key input (temp)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt')
            return
        }

        // transition to move if pressing a movement key
        if(left.isDown || right.isDown || up.isDown || down.isDown ) {
            this.stateMachine.transition('move')
            return
        }
    }
}

class MoveState extends State {
    execute(scene, thug) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey

        // transition to swing if pressing space
        if(space.isDown) {
            this.stateMachine.transition('attack')
            return
        }

        // transition to dash if pressing shift
        if(shift.isDown) {
            this.stateMachine.transition('block')
            return
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt')
            return
        }

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('idle')
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
            thug.direction = 'left'
        } else if(right.isDown) {
            moveDirection.x = 1
            thug.direction = 'right'
        }
        // normalize movement vector, update thug position, and play proper animation
        moveDirection.normalize()
        thug.setVelocity(thug.thugVelocity * moveDirection.x, thug.thugVelocity * moveDirection.y)
        thug.anims.play(`walk-${thug.direction}`, true)
    }
}

class AttackState extends State {
    execute(scene, thug) {
        const { left, right, up, down, space, shift } = scene.keys

        thug.setVelocity(0)
        thug.anims.play(`attack-${thug.direction}`, true)
        if(!(space.isDown)) { 
            this.stateMachine.transition('idle')
            return
        }
    }
}

class HurtState extends State {
    enter(scene, thug) {
        thug.setVelocity(0)
        thug.anims.play(`walk-${thug.direction}`)
        thug.anims.stop()
        thug.setTint(0xFF0000)     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(thug.direction) {
            case 'left':
                thug.setVelocityX(thug.thugVelocity)
                break
            case 'right':
                thug.setVelocityX(-thug.thugVelocity)
                break
        }

        // set recovery timer
        scene.time.delayedCall(thug.hurtTimer, () => {
            thug.clearTint()
            this.stateMachine.transition('idle')
        })
    }
}