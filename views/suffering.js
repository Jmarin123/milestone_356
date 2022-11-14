const Quill = require('quill');
const QuillCursors = require('quill-cursors');

Quill.register('modules/cursors', QuillCursors);

const quill = new Quill(document.querySelector('#editor'), {
    modules: {
        cursors: true,
        toolbar: [
            // adding some basic Quill content features
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
        ],
        history: {
            // Local undo shouldn't undo changes
            // from remote users
            userOnly: true
        }
    },
    placeholder: 'Start collaborating...',
    theme: 'snow' // 'bubble' is also great
})

