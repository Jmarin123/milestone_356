// ... add imports and fill in the code
import * as Y from 'yjs';
//import QuillDeltaToHtmlConverter from 'quill-delta-to-html'
class CRDTFormat {
  public bold?: Boolean = false;
  public italic?: Boolean = false;
  public underline?: Boolean = false;
};

exports.CRDT = class {
  ydoc;
  cb;
  ytext;

  constructor(cb: (update: string, isLocal: Boolean) => void) {
    ['update', 'insert', 'delete', 'toHTML'].forEach(f => (this as any)[f] = (this as any)[f].bind(this));
    this.cb = cb;
    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getText();
    this.ydoc.on('update', (update: Uint8Array) => {
      const u8 = Array.from(update);
      const array = JSON.stringify(u8);
      this.cb(array, true);
    })
  }

  update(update: string) {
    const parsed = JSON.parse(update);
    const gettingU = Uint8Array.from(parsed);
    Y.applyUpdate(this.ydoc, gettingU);
  }
  insert(index: number, content: string, format: CRDTFormat) {
    this.ytext.insert(index, content, format)
  }

  delete(index: number, length: number) {
    this.ytext.delete(index, length);
  }
  insertImage(index: number, url: string) {
    let delta = [{
      retain: index
    }, {
      insert: {
        image: url
      }
    }
    ]
    this.ytext.applyDelta(delta);
  }
  toHTML() {
    var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
    var deltaOps = this.ytext.toDelta();
    var converter = new QuillDeltaToHtmlConverter(deltaOps);

    var html = converter.convert();
    return html;
  }
};
