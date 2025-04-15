myCanvas.width=300;
myCanvas.height=400;
const margin=2;
const n=20;
const array=[];
let moves=[];
const cols=[];
const spacing= myCanvas.width/n;
const ctx=myCanvas.getContext("2d");
const maxColumnHeight=200;


const sorted = new Array(n).fill(false);//new array to keep track of which indices are sorted (new line added for animation)


init();
let audioCtx= null;
function playNote(freq,type)
{
    if(audioCtx==null)
    {
        audioCtx=new(AudioContext|| webkitAudioContext||window.webkitAdioContext)();
    }
    const dur=0.2;
    const osc = audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.type=type;
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.4;
    node.gain.linearRampToValueAtTime(0,audioCtx.currentTime+dur);
    osc.connect(node);
node.connect(audioCtx.destination);
}
function init(){
    for(let i=0;i<n;i++)
        {
            array[i]= Math.random();
        }
        moves=[];
        for(let i=0;i<array.length;i++)
            {
                const x=i*spacing+spacing/2+margin;
                const y=myCanvas.height-margin;
                const width=spacing-4;
                const height= maxColumnHeight*array[i];
                cols[i]= new Column(x,y,width,height);
               
            }
}
function play()
{
    moves=bubbleSort(array);
}



animate();
 function bubbleSort(array)
 {
    const moves=[];
    let n= array.length; // new line added for animation
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++)
        {
            if(array[i-1]>array[i])
            {
                swapped=true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
                moves.push(
                    {indices:[i-1,i],swap:true}
                );
            }else{
                moves.push(
                    {
                        indices:[i-1,i],swap:false
                    }
                );
            }
        }

        n--; //the last element is sorted (new line added for animation)
        moves.push(
            { 
                indices: [n], sorted: true 
            } //  Add this line to mark sorted
        ); // new portion added for updation

    }
    while(swapped);
    return moves;
 }
  
 


function animate()
{
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    let changed=false;
    for(let i=0;i<cols.length;i++)
    {
      //changed=cols[i].draw(ctx)||changed;

      changed = cols[i].draw(ctx, sorted[i]) || changed;    //new line updated for animation


    }
    if(!changed && moves.length>0)
    {
        const move= moves.shift();

    //  Check for sorted move
    if (move.sorted) {
        move.indices.forEach(index => sorted[index] = true);
        return requestAnimationFrame(animate);
    } //new portion added for animation


    const[i,j]=move.indices;
        const waveformtype=move.swap?"square":"sine";
        playNote(cols[i].height+cols[j].height,waveformtype);
        if (move.swap) {
            [cols[i], cols[j]] = [cols[j], cols[i]];
        
            const tempX = cols[i].x;
            cols[i].moveTo({ x: cols[j].x, y: cols[i].y });
            cols[j].moveTo({ x: tempX-1, y: cols[j].y });
        }
        
        else{
            cols[i].jump();
            cols[j].jump();

        }
    }
    requestAnimationFrame(animate);
}