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

//const sorted = new Array(n).fill(false);

init();
let audioCtx= null;
function playNote(freq,type)
{
    if(audioCtx==null)
    {
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
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

 function play() {
    moves = [];
    quickSort(array, 0, array.length - 1);
}

animate();
function quickSort(array, left, right) {
    if (left < right) {
        const pivotIndex = partition(array, left, right);
        quickSort(array, left, pivotIndex - 1);
        quickSort(array, pivotIndex + 1, right);
    }
}

function partition(array, left, right) {
    const pivot = array[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        moves.push({ indices: [j, right], swap: false }); // comparison with pivot

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            moves.push({ indices: [i, j], swap: true }); // actual swap
        }
    }

    [array[i + 1], array[right]] = [array[right], array[i + 1]];
    moves.push({ indices: [i + 1, right], swap: true }); // final pivot swap

    return i + 1;
}



function animate()
{
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    let changed=false;
    for(let i=0;i<cols.length;i++)
    {
      changed=cols[i].draw(ctx)||changed;
    }
    if(!changed && moves.length>0)
    {
        const move= moves.shift();
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