/////////////////////////////////////
// SVG HELPER
/////////////////////////////////////

function createSVGElement(tagName) {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName);
  }
  
  function createLine(svg, x1, y1, x2, y2) {
      let line = createSVGElement("line");
      line.setAttribute("class","my-line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      svg.appendChild(line);
  }
  
  
  function createRectangle(svg, width, height,x=0,y=0) {
      let rect = createSVGElement("rect");
      rect.setAttribute("class","my-rect");
  
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
  
      rect.setAttribute("width", width);
      rect.setAttribute("height", height);
      svg.appendChild(rect);
  }
  
  
  function createText(svg, textContent, x, y,size) {
      let text = createSVGElement("text");
  
      text.setAttribute("class","my-text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("fill", "black");
      text.setAttribute("font-size", size);
  
      text.setAttribute("text-anchor", "middle"); // Align text horizontally to the center
      text.setAttribute("dominant-baseline", "middle"); // Align text vertically to the center
  
      text.textContent = textContent;
  
      svg.appendChild(text);
  }
  
  // Function to create a group and apply a transformation
  function createGroup(svg, name, transform) {
      let group = createSVGElement("g");
      group.setAttribute("class", name);
      group.setAttribute("transform", transform);
      svg.appendChild(group);
      return group;
  }
  
  ///////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////
  
  function getRandomElement(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
  }
  
  //////////////////////////////////////////////////////
  //Vect
  /////////////////////////////////////////////////////
  
  class Vect{
      constructor(i,j,direction) {
        this.i=i;
        this.j=j;
        this.direction = direction;
  
        // sub coordoné
        //sous grie des tile 
        //      (x,y)
        //  ------------
        // |           |
        // |    +(i,j) |(x,y)
        // |           |
        // -------------
        switch (direction) {
          case "N":
            this.x = 2*i+1;
            this.y = 2*j+1-1;
            break;
          case "S":
            this.x = 2*i+1;
            this.y =  2*j+1+1;
            break;
          case "E":
            this.x = 2*i+1+1;
            this.y = 2*j+1;
            break;
          case "O":
            this.x = 2*i+1-1;
            this.y = 2*j+1;
            break;
        }
      }
      
      display(svg,offsetX,offsetY,lengthPx){
  
      
        
        switch (this.direction) {
            case "N":
              createLine(svg,(this.i) * lengthPx +offsetX, (this.j) * lengthPx+ offsetY, (this.i) * lengthPx+ offsetX, (this.j-1) * lengthPx+ offsetY);
      
              break;
            case "S":
              createLine(svg,(this.i) * lengthPx+ offsetX, (this.j) * lengthPx+ offsetY, (this.i) * lengthPx+ offsetX, (this.j+1) * lengthPx+ offsetY);
            
              break;
            case "E":
              createLine(svg,(this.i) * lengthPx+ offsetX, (this.j) * lengthPx+ offsetY, (this.i+1) * lengthPx+ offsetX, (this.j) * lengthPx+ offsetY);
         
              break;
            case "O":
              createLine(svg,(this.i) * lengthPx+ offsetX, (this.j) * lengthPx+ offsetY, (this.i-1) * lengthPx+ offsetX, (this.j) * lengthPx+ offsetY);
            
              break;
        }
        
      }
  }
  
  //////////////////////////////////////////////////////
  //Card
  /////////////////////////////////////////////////////
  
  
  class Card {
      constructor(x,y,size,shape) {
          this.x = x*size;
          this.y = y*size;
          this.size =size;
          this.shape = shape;
          this.masked = false;
      }
      
      flipMask(){
         this.masked = ! this.masked;
      }
      
      getInfo(){
        return this.shape;
      }
      
      display(svg){
        
          let group = createGroup(svg,"card", `translate(${this.x}, ${this.y})`);
      
          //svg.appendChild(rect);
          createRectangle(group, this.size, this.size);
          createLine(group, -this.size/16, this.size/2, this.size/4, this.size/2);
          createLine(group, this.size / 2, -this.size/16, this.size / 2, this.size/4);
      
          createLine(group,3*this.size/4, this.size / 2, this.size+this.size/16,  this.size / 2);
          createLine(group,this.size / 2, 3*this.size/4,  this.size / 2,  this.size+this.size/16);
          
          if(!this.masked){
              switch (this.shape) {
                  case "C":
                  
                  createLine(group,this.size/4,this.size / 2, this.size / 2, this.size-this.size/4 );
                  createLine(group,this.size-this.size/4, this.size / 2,this.size / 2,  this.size/4); 
                  break;
          
                  case "A":
                      createLine(group,this.size/4,this.size / 2,  this.size / 2,  this.size/4);
                      createLine(group,this.size-this.size/4, this.size / 2,this.size / 2, this.size-this.size/4);
                  break;
          
                  case "B":
                      createLine(group, this.size/4, this.size / 2, (3*this.size)/4,  this.size / 2);
                  //line( this.size / 2,  this.size/4,  this.size / 2, (3*this.size)/4  );
                  createLine(group, this.size / 2, this.size/4, this.size / 2, this.size/4+this.size/8);
                  createLine(group, this.size / 2, 3*this.size/4, this.size / 2, 3*this.size/4 -this.size/8);
                  break;
          
                  default:
                  break;
              }
        }
      }
  }
  /////////////////////////////////////////////
  //
  ////////////////////////////////////////////
  
  
  
  class PlayGround{
      constructor(numRows,numCols,cardSize,configuration) {
          this.numRows  = numRows;
          this.numCols  = numCols;
          this.cardSize = cardSize;
          this.margin = 1;
          
          //init the map 
  
          this.cardMatrix = new Array(numRows);
          for (let i = 0; i < this.numRows; i++) {
              this.cardMatrix[i] = new Array(numCols);
              for (let j = 0; j < this.numCols; j++) {
                //console.log(j+(i*this.numRows))
      
                if (configuration[i+(j*this.numRows)] === 0){
                  this.cardMatrix[i][j] = new Card(i,j,this.cardSize,"B","N");
                }else if (configuration[i+(j*this.numRows)] === 1){
                  this.cardMatrix[i][j] = new Card(i,j,this.cardSize,"A","N");
                }else{
                  this.cardMatrix[i][j] = new Card(i,j,this.cardSize,"C","E");
                }
              }
          }
          
          
          //turn 
  
          //get the connection between edges
          let connections = []
          //could be better
          for (let i = 0; i < this.numRows; i++) {
              const start = new Vect(i,0,"N");
              let path = []
              this.getPath(start,path);
              connections.push(path);
          }
  
          //make the path form all the edge to an others edge
          //could be optimise by 2,  
          for (let j = 0; j < this.numCols; j++) {
            const start = new Vect(0,j,"O");
            let path = []
            this.getPath(start,path);
            connections.push(path);
          }
  
          for (let i = 0; i < this.numRows; i++) {
            const start = new Vect(i,this.numCols-1,"S");
            let path = []
            this.getPath(start,path);
            connections.push(path);
          }
  
          for (let j = 0; j < this.numCols; j++) {
            const start = new Vect( this.numRows-1,j,"E");
            let path = []
            this.getPath(start,path);
            connections.push(path);
          }
          //console.log(connections)
  
          //we want the connection  
  
          this.connectionR = new Array(connections.length);
          for (let i = 0; i < connections.length; i++) {
          
            let input = this.coordLat(connections[i][0].x,connections[i][0].y,numRows,numCols );
            let output =this.coordLat(connections[i][connections[i].length-1].x,connections[i][connections[i].length-1].y,numRows,numCols );
            this.connectionR [input] = output;
          }
          //console.log( this.connectionR )
      }
  
      //use to calculate the lateral coor
      coordLat(x,y,numRows,numCols ){
        //    1
        //   ___
        // 4|   | 2
        //   ---
        //    3
        if(y === 0 ){//1
          return Math.floor(x/2);
        }else if (x === 2*numRows){//2
          return Math.floor(y/2) +numRows;
        }else if (y === 2*numCols){//3
          return  (2*numRows+numCols-1) -Math.floor(x/2);
        }else if (x === 0){
          return  (2*numRows+2*numCols-1)-Math.floor(y/2);
        }else{
          return NaN;
        }
  
      }
      
      display(svg,mask){
          let group = createGroup(svg,"bord"," translate(0, 0)");
          this.drawCards(group,mask);
      }
      
      drawCards(svg,mask){
          // plot the number also
          //const txSize = this.cardSize/3;
          for (let i = 0; i < this.numRows; i++) {
              for (let j = 0; j < this.numCols; j++) {
                  if(mask[i+(j*this.numRows)]){
                    this.cardMatrix[i][j].flipMask()
                  }
                  this.cardMatrix[i][j].display(svg);
              }
          }
  
      }
      
      drawPath(initVect){
          let path = [];
          this.getPath(initVect,path)
          //console.log(path)
          for (let i = 0; i < path.length; i++) {
              path[i].display(this.cardSize/2,this.cardSize/2, this.cardSize); 
          }
      }
      
      
      getPath(initVect,path =[]){
        
          path.push(initVect);
          if (
          (initVect.i < 0 ) || (initVect.j  < 0) ||
          (initVect.i >= this.numRows)|| (initVect.j >= this.numCols)
          ){
              return;
          }
    
       
        //////////////
    
        //    N
        //    |
        // O--+--E
        //    |
        //    S  
        //
    
        //run
        // AN AS //
        // AE AO \\
        // B +
    
          let nextDir = "";
          switch (this.cardMatrix[initVect.i][initVect.j].getInfo()) {
      
              case "A":
              //      N
              //      | __E
              // O __/ /
              //       |
              //       S
              switch (initVect.direction) {
                  case "N":
                  nextDir = "O";
                  break;
                  case "S":
                  nextDir = "E";
                  break;
                  case "E":
                  nextDir = "S";
                  break;
                  case "O":
                  nextDir = "N";
                  break;
              }
              break;
      
              case "C":
              //       N
              //  O __ | 
              //      \ \__E
              //       |
              //       S
              switch (initVect.direction) {
                  case "N":
                  nextDir = "E";
                  break;
                  case "S":
                  nextDir = "O";
                  break;
                  case "E":
                  nextDir = "N";
                  break;
                  case "O":
                  nextDir = "S";
                  break;
              }
              break;
      
              case "B":
              //    N
              //    |
              // O--+--E
              //    |
              //    S  
              //
              switch (initVect.direction) {
                  case "N":
                  nextDir = "S";
                  break;
                  case "S":
                  nextDir = "N";
                  break;
                  case "E":
                  nextDir = "O";
                  break;
                  case "O":
                  nextDir = "E";
                  break;
              }
      
              break;
      
          }
      
          ///next card 
          //change the output direction of the actual card to the input dir of the next card
          switch (nextDir) {
              case "N":
                  this.getPath(new Vect(initVect.i,initVect.j-1,"S"),path);
              break;
              case "S":
                  this.getPath(new Vect(initVect.i,initVect.j+1,"N"),path);
              break;
              case "E":
                  this.getPath(new Vect(initVect.i+1,initVect.j,"O"),path);
              break;
              case "O":
                  this.getPath(new Vect(initVect.i-1,initVect.j,"E"),path);
              break;
          }
          
      }
          
  }
  
  //////////////////////////////////////////////////////
  //GAME
  /////////////////////////////////////////////////////
  class Game{
      constructor(numRows,numCols,cardSize){
        this.numRows    = numRows;
        this.numCols    = numCols;
        this.cardSize   = cardSize;
    
        this.mask = new Array(numRows*numCols);
        
        
        // Global array to track deletion counts
        this.deletionCounts = [];
        //the posibilities
        this.matrix = [];
        
    
        //generation and level ?
        const tile = [0,1,2];
        let configuration = new Array(numRows*numCols);
        for (let i = 0; i < configuration.length; i++) {
          configuration[i] = getRandomElement(tile);
          this.mask[i] = getRandomElement([false,false,false,false,false,false,true]);
        }
        //given mask generate all possibility of solution 
        this.combinations = this.generateMaskedCombinations(configuration, this.mask );
        
    
    
        //generate all PlayGround to have the input / output connection 
        this.combinations.forEach((combination, index) => {
          //console.log(`Combination ${index}:`, combination);
          let connectionMap = new PlayGround(numRows,numCols,cardSize,combination).connectionR;
          this.matrix.push(connectionMap) ;
        });
    
    
        //supress some element of the conection to make the game
    
        let numberOfAmbiguous = 0;
        let sizeOfAmbiguous = 0;
        this.matrix = this.transposeMatrix(this.matrix);
    
        for (let i = 0; i < this.matrix.length; i++) {
          this.matrix[i] = this.removeDuplicates(this.matrix[i]);
          if(this.matrix[i].length !== 0){
            //on regade le nombre delement a suprimé 
            numberOfAmbiguous += 1;
            sizeOfAmbiguous = this.matrix[i].length;
          }
        }
    
    
        /// mke it resolvable
        // the idear is to suppres somme of the posibility and 
        // the only left is the first one 
        for (let i = 0; i < this.matrix.length; i++) {
          this.deleteRandomElements(this.matrix[i],Math.ceil(sizeOfAmbiguous/numberOfAmbiguous));
          this.matrix[i].sort(function(a, b) {return a - b;});
        }
    
    
      }
    
    
      generateMaskedCombinations(stateArray, mask) {
        const result = [];
        const mutableIndices = [];
      
        // Identify the mutable indices based on the mask
        for (let i = 0; i < mask.length; i++) {
            if (mask[i]) {
                mutableIndices.push(i);
            }
        }
      
        function generate(currentIndex) {
            if (currentIndex === mutableIndices.length) {
                result.push(stateArray.slice());
                return;
            }
      
            let mutableIndex = mutableIndices[currentIndex];
            for (let i = 0; i < 3; i++) {
                stateArray[mutableIndex] = i;
                generate(currentIndex + 1);
            }
        }
      
        generate(0);
        return result;
      }
      
      transposeMatrix(matrix) {
        if (matrix.length === 0) return [];
      
        let rows = matrix.length;
        let cols = matrix[0].length;
        let transposed = [];
      
        for (let col = 0; col < cols; col++) {
            let newRow = [];
            for (let row = 0; row < rows; row++) {
                newRow.push(matrix[row][col]);
            }
            transposed.push(newRow);
        }
      
        return transposed;
      }
      
    
      deleteRandomElements(array, N) {
          // Initialize deletionCounts array if needed
          if (this.deletionCounts.length !== array.length) {
            this.deletionCounts = Array.from({length: array.length}, () => 0);
          }
      
          // Create a list of indices (excluding index 0) along with their deletion counts
          let indices = Array.from({length: array.length - 1}, (_, i) => ({index: i + 1, count: this.deletionCounts[i + 1]}));
      
          // Sort indices by deletion count, then shuffle within the same count to add randomness
          indices.sort((a, b) => a.count - b.count || Math.random() - 0.5);
      
          // Select the first N indices
          let selectedIndices = indices.slice(0, N).map(obj => obj.index);
      
          // Sort in descending order for deletion
          selectedIndices.sort((a, b) => b - a);
      
          // Delete elements and update deletion counts
          for (let index of selectedIndices) {
              array.splice(index, 1);
              this.deletionCounts[index]++;
          }
      }
      
      
      removeDuplicates(array) {
        return Array.from(new Set(array));
      }
      
    
      ////////////////////////////////////////////
      //plot fuction test 
      ///////////////////////////////////////////
      //to plot the posibilitys in a square 
    
      drawArrayInGrid(svg,array, gridSize,a,b) {
  
        // Calculate the number of rows and columns based on the array length
        let cols = Math.ceil(Math.sqrt(array.length));
        let rows = Math.ceil(array.length / cols);
    
        // Calculate the size of each individual square
        let squareSize = gridSize / Math.max(cols, rows);
    
        // Draw each element as a square
        let group = createGroup(svg,"array", "translate(0, 0)");
        for (let i = 0; i < array.length; i++) {
          let x = (i % cols) * squareSize +a;
          let y = Math.floor(i / cols) * squareSize+b;
  
          createRectangle(group, squareSize, squareSize,x, y);
          createText(group,array[i], x + squareSize / 2, y + squareSize / 2);
        }
      
      }
    
      drawAndNumberBorderSquares(svg,cols,rows, size,possibilities) {
      
        let counter = 0; // Start numbering from 0
     
        let group = createGroup(svg,"border", "translate(0, 0)");
        // Top row (excluding first and last columns)
        for (let i = 0; i < cols ; i++) {
          let x = i * size;
          //rect(x, -1 * size, size, size); 
          createRectangle(group, size, size, x, -1 * size);
          this.drawArrayInGrid(group,possibilities[counter], size,x,-1 * size);
          createText(group,counter, x + size / 2, -1 * size + size / 2,size);
          counter++;
        }
    
        // Right column (excluding first and last rows)
        for (let i = 0; i < rows; i++) {
          let y = i * size;
          //rect(cols * size, y, size, size);
          createRectangle(group, size, size,cols * size, y);
          this.drawArrayInGrid(group,possibilities[counter], size,cols * size,y);
          createText(group,counter, cols * size + size / 2, y + size / 2,size);
          counter++;
        }
    
        // Bottom row (excluding first and last columns and going backwards)
        for (let i = cols -1 ; i >= 0; i--) {
          let x = i * size;
          //rect(x, rows * size, size, size);
          createRectangle(group, size, size,x, rows * size);
          this.drawArrayInGrid(group,possibilities[counter], size,x,rows * size);
          createText(group,counter, x + size / 2, rows * size + size / 2,size);
          counter++;
        }
    
        // Left column (excluding first and last rows and going backwards)
        for (let i = rows - 1; i >= 0; i--) {
          let y = i * size;
          //rect(-1 * size, y, size, size);
          createRectangle(group, size, size,-1 * size, y);
          this.drawArrayInGrid(group,possibilities[counter], size,-1 * size ,y);
          createText(group,counter, -1 * size + size / 2, y + size / 2,size);
          counter++;
        }
      }
    
    
      drawGridAndNumber(cols, rows, size) {
        let counter = 0; // Start numbering from 0
        fill(255); // Color for grid squares
        textSize(16);
        textAlign(CENTER, CENTER);
    
        // Draw the grid and number each cell
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            let x = j * size;
            let y = i * size;
            rect(x, y, size, size);
            fill(0); // Text color
            text(counter++, x + size / 2, y + size / 2);
            fill(255); // Reset fill color for next square
          }
        }
      }
    
    
      display(svg){
        let group = createGroup(svg,"game", `translate(${this.cardSize}, ${this.cardSize})`);
        let playGround = new PlayGround(this.numRows,this.numCols,this.cardSize,this.combinations[0]);
        //
        //translate(this.cardSize,this.cardSize);
        
        let group2 = createGroup(group,"game", "translate(0, 0)");
        playGround.display(group2,this.mask); 
        this.drawAndNumberBorderSquares(group,this.numRows, this.numCols, this.cardSize,this.matrix);
      }
    }
    
    
    
  
  
  
  //////////////////////////////////////////////////////
  //MAIN
  /////////////////////////////////////////////////////

  
  document.addEventListener("DOMContentLoaded", function() {
    
      // Get the SVG container and append the circle to it
      let nbTilesX = 5;
      let nbTilesY = 5;
      let svgElement = document.getElementById("TheGame");

      let svgWidth = svgElement.getBoundingClientRect().width;
      let svgHeight = svgElement.getBoundingClientRect().height;

      const size =  Math.min(svgWidth/(nbTilesX+2.2), svgHeight/(nbTilesY+2.2));

      let aa = new Game(5,5,size);
      aa.display(svgElement)
  });