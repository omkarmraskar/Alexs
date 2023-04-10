class UndoRedo {
    constructor(graph) {
      this.graph = graph;
      this.undoStack = [];
      this.redoStack = [];
    }
  
    saveState() {
      const recall = JSON.parse(JSON.stringify(this.graph.getRecall()));
      this.undoStack.push(recall);
      this.redoStack = [];
    }
  
    undo() {
      if (this.canUndo()) {
        console.log('undo');
        const recall = this.undoStack.pop();
        this.redoStack.push(recall);
        this.graph.emptyGraph();
        this.graph.resetGraph(this.undoStack[this.undoStack.length - 1]);
      }
    }
  
    redo() {
      if (this.canRedo()) {
        console.log('undo')
        const recall = this.redoStack.pop();
        this.undoStack.push(recall);
        this.graph.emptyGraph();
        this.graph.resetGraph(this.undoStack[this.undoStack.length - 1]);
      }
    }
  
    canUndo() {
      return this.undoStack.length > 1;
    }
  
    canRedo() {
      return this.redoStack.length > 0;
    }
  }
  
  const undoRedo = new UndoRedo(graph);