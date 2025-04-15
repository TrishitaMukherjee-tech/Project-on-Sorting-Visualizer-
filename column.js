class Column {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.queue = [];
        this.color={
            r:150,
            g:150,
            b:150
        }
    }
    

    moveTo(loc, yOffset = 1, frameCount = 20) {
        const startX = this.x;
        const startY = this.y;
        for (let i = 1; i <= frameCount; i++) {
            const t = i / frameCount;
            const u = Math.sin(t * Math.PI);
            this.queue.push({
                x: lerp(startX, loc.x, t),
                y: lerp(startY, loc.y, t) + u * this.width / 2 * yOffset,
                r:lerp(150,255,u),
                g:lerp(150,0,u),
                b:lerp(150,0,u),
            });
        }
    }

    jump(frameCount = 20) {
        const originalY = this.y;
        for (let i = 1; i <= frameCount; i++) {
            const t = i / frameCount;
            const u = Math.sin(t * Math.PI);
            this.queue.push({
                x: this.x,
                y: originalY - u * this.width
            });
        }
    }

    // draw(ctx) {

    //updating draw() method for animatio purpose

    draw (ctx, isSorted = false) {

    
        let changed = false;
        if (this.queue.length > 0) {
            const { x, y ,r,g,b} = this.queue.shift();
            this.x = x;
            this.y = y;
            this.color={r,g,b};
            changed = true;
        }

        const left = this.x - this.width / 2;
        const top = this.y - this.height;
        const right = this.x + this.width / 2;

        ctx.beginPath();

        let r,g,b ; 
        if (isSorted){
            //green for sorted bars
            r = 0; g = 200; b = 0;
        } else {
            // Use the object's current color
            ({ r, g, b } = this.color);
            
        }
        
        //const {r,g,b}=this.color;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.moveTo(left, top);
        ctx.lineTo(left, this.y);
        ctx.ellipse(this.x, this.y, this.width / 2, this.width / 4, 0, Math.PI, Math.PI * 2, true);
        ctx.lineTo(right, top);
        ctx.ellipse(this.x, top, this.width / 2, this.width / 4, 0, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();

        return changed;
    }
}
