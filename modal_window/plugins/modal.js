function _createModal(options) {
    const DEFAULT_WIDTH = '500px'
    const modal = document.createElement('div');
    modal.classList.add('modal');

    modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay" data-close="true">
        <div class="modal-window" style="width: ${options.width ||  DEFAULT_WIDTH}">
            <div class="modal-head">
                <span class="modal-title">${options.title || 'Title of Window'}</span>
                ${options.closable ? `<span class="close" data-close="true">&times;</span>` : ''}
            </div>
            <div class="modal-body" data-content>
                ${options.content || ''}
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
    const darkTimeout = 200;
    const $modal = _createModal(options);
    let closing = false;
    let destroyed = false;

    const suitModals = {
        open() {
            if(destroyed){
                return console.log('Method is distroed')
            }
            !closing && $modal.classList.add('open');
        },
        close() {
            closing = true;
            $modal.classList.remove('open');
            $modal.classList.add('dark')
            setTimeout(() =>{
                $modal.classList.remove('dark')
                closing = false;
            }, darkTimeout)
        }
    }

    const listener = (event) => {
        if (event.target.dataset.close){
            suitModals.close();
        }
    }

    $modal.addEventListener('click', listener)

    return Object.assign(suitModals, {
        destroy(){
            $modal.remove();
            $modal.removeEventListener('click', listener)
            destroyed = true;
        },
        setContent(html){
            $modal.querySelector('[data-content]').innerHTML = html;
        }
    })
}