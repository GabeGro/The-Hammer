class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction) {
        super (scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)

        this.direction = direction 
        this.enemyVelocity = 75    // in pixels
        this.hurtTimer = 250       // in ms

        // initialize state machine managing enemy (initial state, possible states, state args[])
        scene.enemyFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            attack: new AttackState(),
            hurt: new HurtState(),
        }, [scene, this])
    }
}

class IdleState extends State {
    enter(scene, enemy) {
        enemy.setVelocity(0)
        enemy.anims.play(`walk-${enemy.direction}`)
        enemy.anims.stop()
    }

    execute(scene, enemy) {
        const player = scene.player1

        if (Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y) < 200) {
            this.stateMachine.transition('move')
            return
        }
    }
}

class MoveState extends State {
    execute(scene, enemy) {
        const player = scene.player1
        const direction = new Phaser.Math.Vector2(player.x - enemy.x, player.y - enemy.y).normalize()

        if (direction.x < 0) {
            enemy.direction = 'left'
        } else {
            enemy.direction = 'right'
        }
        
        enemy.setVelocity(direction.x * enemy.enemyVelocity, direction.y * enemy.enemyVelocity)
        enemy.anims.play(`walk-${enemy.direction}`, true)

        if (Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y) < 50) {
            this.stateMachine.transition('attack')
        }
    }
}

class AttackState extends State {
    enter(scene, enemy) {
        this.stateMachine.transition('idle')
    }
}

class HurtState extends State {
    enter(scene, enemy) {
        enemy.setVelocity(0)
        enemy.anims.play(`walk-${enemy.direction}`)
        enemy.anims.stop()
        enemy.setTint(0xFF0000)     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(enemy.direction) {
            case 'left':
                enemy.setVelocityX(enemy.enemyVelocity)
                break
            case 'right':
                enemy.setVelocityX(-enemy.enemyVelocity)
                break
        }

        // set recovery timer
        scene.time.delayedCall(enemy.hurtTimer, () => {
            enemy.clearTint()
            this.stateMachine.transition('idle')
        })
    }
}