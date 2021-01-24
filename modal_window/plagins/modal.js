function _createModal(options) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay">
        <div class="modal-window">
            <div class="modal-head">
                <span class="modal-title">Title of Window</span>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <p>First line in modal window.</p>
                <p>Second line in modal window.</p>
            </div>
            <div class="modal-footer">
                <button class="ok">Ok</button>
                <button class="cancel">Cancel</button>
            </div>
        </div>
    </div>
    `)
    document.body.appendChild(modal)
    return modal
}

$.modal = function (options) {
    const $modal = _createModal(options);

    return {
        open() {
            $modal.classList.add('open');
        },
        close() {
            $modal.classList.remove('open')
        },
        destroy() {

        }
    }
}