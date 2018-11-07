
import Layer from './../../render/layer'
import Sprite from './../../render/sprite'
import FruitType from './fruit-type'
import global from './../../global'
import resources from './../resources'
import director from './../../render/director'
import State from './../../common/state'
class Fruit extends Layer{
    constructor(){
        super();
        this._nowTime = new Date().getTime();
        director.root.ticker.add(this.update.bind(this));
        this._state = new State();
        // this.interactive = true;
        // this.on('pointerdown', this.touchStart.bind(this))
        // .on('pointerup', this.touchEnd.bind(this))
        // .on('pointerupoutside', this.touchEnd.bind(this))
        // .on('pointermove', this.touchMove.bind(this));
       
        
    }
    // touchStart(){
    //     console.log('touch start');
    // }
    // touchMove(){
    //     if (this._state.getState() === 'run'){
    //         this._state.setState('cut');

    //     }
    // }
    // touchEnd(){

    // }
    init(controller, id){
        this._fruitId = id;
        let typeList = Object.keys(FruitType);
        let type = typeList[Math.round(Math.random() * (typeList.length - 1))];
        this._fruitCellList = [];
        this._type = type;
        for (let i = 0 ; i < 2 ; i ++){
            let str = FruitType[type] + '_' + i;
            let sprite = new Sprite(global.resource[resources[str]].texture);
            this.addChild(sprite);
            this._fruitCellList.push(sprite);
        }
        this.width = this._fruitCellList[0].width;
        this.position = {
            x: director.width * 0.5 + (Math.random() * 100 - 50),
            y: director.height + 50
        }
        this._state.setState('run');

        this._direction = {
            x: Math.random() * 0.4 - 0.2,
            y: Math.random() * 0.3 + 0.7
        }
        this._accY = -0.02;
        this._rotationSpeed = Math.random() * 0.2 - 0.1;

        this._state.addState('run-end', ()=>{
            controller.fruitActionCb('run-end', this._fruitId);
        })
        this._state.addState('cut', ()=>{
            //
            this._cellSpeedX = Math.random() * 0.3 + 0.2;
            this._cellRotationSpeed = Math.random() * 0.2 - 0.1;
        });
    }
    update(){
        if (this._state.getState() === 'run' || this._state.getState() ==='cut'){
            let currentTime = new Date().getTime();
            let dt = currentTime - this._nowTime;
            this._nowTime = currentTime;

            this.position = {
                x: this.position.x + this._direction.x * dt,
                y: this.position.y - this._direction.y * dt
            }
            this._direction.y = this._direction.y + this._accY;
            if (this._state.getState() === 'run'){
                this.rotation += this._rotationSpeed;
            }
            if (this._state.getState() === 'cut'){
                for (let i = 0 ; i < this._fruitCellList.length ; i ++){
                    let cell = this._fruitCellList[i];
                    cell.position = {
                        x: cell.position.x + (i?1:-1) * this._cellSpeedX * dt,
                        y: 0
                    }
                    cell.rotation += this._cellRotationSpeed;

                }
            }
            if (this.position.y > director.height + 100){
                this._state.setState('run-end');
            }
        }
    }
    cut(){
        if (this._state.getState() === 'run'){
            this._state.setState('cut');
            return true;
        }
        return false;
    }
    getType(){
        return this._type;
    }
}
export default Fruit;