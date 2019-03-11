function PhaserViewer(scale, fps, debug){
  //debug = typeof debug !== 'undefined' ? debug : false;
  window.game = new Phaser.Game(scale * 16, scale * 9, Phaser.AUTO);
  this._scale = scale;
}

PhaserViewer.prototype.init = function() {
  
}
