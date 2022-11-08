// ... add imports and fill in the code
import * as Y from 'yjs';
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
      const array = JSON.stringify(update);
      this.cb(array, true);
    })
  }

  update(update: string) {
    const parsed = JSON.parse(update);
    Y.applyUpdate(this.ydoc, parsed);
  }
  insert(index: number, content: string, format: CRDTFormat) {
    this.ytext.insert(index, content, format)
  }

  delete(index: number, length: number) {
    this.ytext.delete(index, length);
  }
  toHTML() {
    var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
    var deltaOps = this.ytext.toDelta();
    var converter = new QuillDeltaToHtmlConverter(deltaOps);

    var html = converter.convert();
    return html;
  }
};