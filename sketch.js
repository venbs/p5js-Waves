const V_COUNT = 5; //波的数量
const V_COL = 210; //色相，从0-360
const V_AMP = 100; //波的振幅
const V_LENGTH = 2; //波长，数字越小波长越长
const FRAMERATE = 60;
let mic;
let mic_level;
let mic_smooth = 0.2;
let smooth_dir;

function setup(){
    Canvas0 = createCanvas(800, 400);
    Canvas0.mousePressed(userStartAudio());
    colorMode(HSB);
    frameRate(FRAMERATE);
    mic = new p5.AudioIn();
    mic.start();
    wave0 = new Waves(V_COUNT,V_COL,V_AMP,V_LENGTH);
}
function draw(){
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = null;
    background(0,0.2);
    mic_level = map(mic.getLevel(),0,0.5,0.08,1,true);
    smooth_dir = mic_level - mic_smooth;
    mic_smooth += smooth_dir * 0.1;
    wave0.running(mic_smooth);
}
class Waves {
    constructor(count,color,amplitude,waveLength){
        this.Waves_array = [];
        for(let i = 0; i < count; i++){
            this.Waves_array[i] = new Wave(
                color + i * (60/count),
                amplitude - amplitude / count * i ,
                waveLength + 2 / count * i ,
                PI / count * i,
                1
            )
        }
    }
    running(micLevel){
        for(let i = 0; i < this.Waves_array.length; i++){
            this.Waves_array[i].update(micLevel);
        }
    }
}

class Wave {
    constructor(color,amplitude,waveLength,Angle,alpha){
        this.wawe_weight = 3;
        this.wawe_height = [];
        this.point_style = [];
        this.amplitude = amplitude || 20;
        this.y = 200;
        this.x = 100;
        this.width = 600 ;
        this.sampling = 50;
        this.wave_speed = 1;
        this.timeOffset = 0;
        this.timeOffsetRate = TWO_PI / FRAMERATE * this.wave_speed;
        this.startAngle = Angle || 0;
        this.waveLength = waveLength || 2;
        this.color = color || 100;
        this.alpha = alpha || 1;
        this.micLevel = 1;
        
    }
    update(micLevel){
        this.motion();
        this.oscilloscope(micLevel);
        this.display();

    }
    motion(){
        this.timeOffset += this.timeOffsetRate;
    }
    oscilloscope(micLevel){
        this.micLevel = micLevel || 1;
        this.wawe_height.length = 0;
        for(let i = 0; i < this.sampling; i++){
            let wave_ori = sin((this.waveLength * TWO_PI/this.sampling * i) + this.timeOffset + this.startAngle); //sine生成正弦波
            let wave_shrink = wave_ori * pow(sin( PI / this.sampling * i),2) * this.amplitude * this.micLevel + this.y; //再用sine函数压缩两侧
            this.wawe_height.push(wave_shrink);

        }
    }
    display(){
        strokeWeight(this.wawe_weight)
        stroke(this.color,100,100,this.alpha);
        noFill();
        blendMode(ADD)
        drawingContext.shadowOffsetX = 0;
		drawingContext.shadowOffsetY = 0;
		drawingContext.shadowBlur = 40;
        drawingContext.shadowColor = color(this.color,100,100,0.3);
        beginShape();
        for(let i = 0; i < this.sampling; i++){
            curveVertex((i * (this.width/ this.sampling)) + this.x, this.wawe_height[i]);
        }
        endShape();
        blendMode(BLEND)
    }
}
