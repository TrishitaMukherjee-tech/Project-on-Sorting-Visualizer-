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

const sorted = new Array(n).fill(false);  //new array to keep track of which indices are sorted (new line for animation)

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
    heapSort(array);
}

animate();

// Heap Sort Logic with Moves


function heapSort(array) {
    let n = array.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(array, n, i);
    }

    // One by one extract elements
    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        moves.push({ indices: [0, i], swap: true }); // actual swap

        moves.push({indices: [i], sorted:true});  //new line to mark sorted index (new line for animation)

        heapify(array, i, 0);
    }
    moves.push({indices: [0], sorted:true}); //Final element (new line for animation)
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
        moves.push({ indices: [left, largest], swap: false }); // compare
        if (arr[left] > arr[largest]) largest = left;
    }

    if (right < n) {
        moves.push({ indices: [right, largest], swap: false }); // compare
        if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        moves.push({ indices: [i, largest], swap: true }); // actual swap
        heapify(arr, n, largest);
    }
}


function animate()
{
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    let changed=false;
    for(let i=0;i<cols.length;i++)
    {
      changed=cols[i].draw(ctx , sorted[i])||changed; // updation for new animation
    }
    if(!changed && moves.length>0)
    {
        const move= moves.shift();
        
        // (new portion added for animation)

        if(move.sorted) {
            move.indices.forEach(index => sorted[index] = true);
            return requestAnimationFrame(animate);

        } // end of the newly added portion

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