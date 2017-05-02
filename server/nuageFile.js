class NuageFile {
  constructor(name, type) {
    this.children = []; 
    this.sources = [];
    this.size = 0;
    this.name = name;
    this.type = type;
    //this.id = id;
    this.isShared = false;
  }
}

module.exports = NuageFile;